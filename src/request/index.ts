import { createRequest } from '@soybeanjs/fetch';
import type { FetchError, FetchResponse } from '@soybeanjs/fetch';
import { createTypedClient, toFlatTypedClient } from '@soybeanjs/fetch/openapi';
import type { paths } from '~ubean/openapi';
import {
  SERVICE_EXPIRED_TOKEN_CODES,
  SERVICE_LOGOUT_CODES,
  SERVICE_MODAL_LOGOUT_CODES,
  SERVICE_SUCCESS_CODE
} from '@/constants/service';
import { getLocalRefreshToken, getLocalToken, handleLogoutRequest, setAuthStorage } from '@/utils/auth';
import { env } from '@/env';
import type { ApiLoginResult } from '@/typings/app';

/** 对象守卫（运行时校验的基石，避免 unknown 上取属性的 as 断言） */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * 统一请求层（v3 §5.4）：业务码判定 + Bearer 注入 + 单飞刷新重放 + 错误去重。
 *
 * - `baseURL` 为空走同源：dev 下 ubean 同进程 Hono，`/api/**` 直接命中；
 *   生产由反向代理/同域部署承接。
 * - `paths` 来自 `.ubean/openapi.d.ts`（仓库唯一 API 类型源）；第二泛型 `'/api'`
 *   是后端挂载前缀，须与路由前缀一致，否则类型路径整体对不上。
 * - `api`（抛异常）与 `flatApi`（永不抛）基于同一实例 —— 本文件的所有钩子对
 *   两者同时生效。
 */

/** 响应 envelope（所有 `/api/**` 恒为该结构，见后端 src/shared/response.ts） */
interface ApiEnvelope<T = unknown> {
  code: string;
  message: string;
  data: T | null;
}

/** 从响应体取 envelope（非 JSON/空体按失败处理） */
function readEnvelope(response: FetchResponse<ApiEnvelope>): ApiEnvelope | null {
  return response.data && typeof response.data === 'object' && 'code' in response.data ? response.data : null;
}

/**
 * refresh-token 响应的受信边界：裸 fetch 的响应体是 `unknown`，先做关键
 * 字段运行时校验，再集中「信任」一次（避免调用处散落 as 断言）。
 */
function trustLoginResult(_value: object): _value is ApiLoginResult {
  return true;
}

function parseRefreshResult(raw: unknown): ApiLoginResult | null {
  if (!isRecord(raw) || raw.code !== SERVICE_SUCCESS_CODE || !isRecord(raw.data)) return null;

  const data = raw.data;
  const { token, refreshToken, user } = data;
  if (typeof token !== 'string' || typeof refreshToken !== 'string' || !isRecord(user)) return null;

  // user 的其余字段后端保证完整，这里只校验关键三字段后放行
  if (typeof user.id !== 'string' || typeof user.username !== 'string' || !Array.isArray(user.roles)) {
    return null;
  }

  return trustLoginResult(data) ? data : null;
}

// ---------------------------------------------------------------------------
// 刷新令牌：独立裸实例（不走主实例钩子，杜绝重入死循环）+ 模块级单飞
// ---------------------------------------------------------------------------

let refreshPromise: Promise<boolean> | null = null;

/** 单飞刷新：并发 401 只发一次 refresh，成功后本地凭据已更新 */
function refreshTokenSingleFlight(): Promise<boolean> {
  refreshPromise ??= (async () => {
    const rawRefreshToken = getLocalRefreshToken();
    if (!rawRefreshToken) return false;

    try {
      const response = await fetch(`${env.apiBaseUrl}${env.apiPrefix}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rawRefreshToken })
      });
      const result = parseRefreshResult(await response.json());

      if (!result) return false;

      setAuthStorage(result);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ---------------------------------------------------------------------------
// 主实例
// ---------------------------------------------------------------------------

/** 业务码 → 动作：expire=刷新重放；modalLogout=弹窗确认登出；logout=静默登出；其余=普通失败 */
function resolveBackendAction(code: string): 'expire' | 'modalLogout' | 'logout' | 'fail' {
  if (SERVICE_EXPIRED_TOKEN_CODES.includes(code)) return 'expire';
  if (SERVICE_MODAL_LOGOUT_CODES.includes(code)) return 'modalLogout';
  if (SERVICE_LOGOUT_CODES.includes(code)) return 'logout';
  return 'fail';
}

/** 错误提示去重：同文案 3s 窗口内只弹一次 */
let lastErrorMessage = '';
let lastErrorAt = 0;

function notifyError(message: string): void {
  const now = Date.now();
  if (message === lastErrorMessage && now - lastErrorAt < 3000) return;

  lastErrorMessage = message;
  lastErrorAt = now;

  // 全局提示由 toast 承接（SConfigProvider 已挂 Provider）；SSR 阶段静默
  if (import.meta.client) {
    import('@vean/ui').then(({ toast }) => toast.error(message));
  }
}

// 第二泛型 `unknown`：DTO（ApiLoginResult 等）不是 envelope 形状，放开 `T extends ApiData` 约束，
// 让 `request.post<ApiLoginResult>(...)` 这类显式 DTO 泛型可用（响应已由 transform 解包）。
const request = createRequest<ApiEnvelope, unknown>(
  { baseURL: env.apiBaseUrl },
  {
    /** envelope 解包：业务数据直接返回 */
    transform: response => response.data?.data,
    isBackendSuccess: response => readEnvelope(response)?.code === SERVICE_SUCCESS_CODE,
    onRequest: config => {
      const token = getLocalToken();
      if (token) config.headers.set('Authorization', `Bearer ${token}`);
      return config;
    },
    /**
     * 后端业务失败：过期码 → 单飞刷新后原配置重放（onRequest 会取新 token）；
     * 登出码 → 移交全局登出回调；其余 → 去重提示后按失败抛出。
     */
    onBackendFail: async (response, instance) => {
      const envelope = readEnvelope(response);
      if (!envelope) return null;

      const action = resolveBackendAction(envelope.code);

      if (action === 'expire') {
        const refreshed = await refreshTokenSingleFlight();
        if (refreshed) return instance(response.config);
        handleLogoutRequest(true);
        return null;
      }

      if (action === 'modalLogout') {
        handleLogoutRequest(false);
        return null;
      }

      if (action === 'logout') {
        handleLogoutRequest(true);
        return null;
      }

      notifyError(envelope.message);
      return null;
    },
    /** 传输层错误（网络/超时/5xx）：去重提示 */
    onError: (error: FetchError<ApiEnvelope>) => {
      notifyError(error.message || '网络异常，请稍后重试');
    }
  }
);

/** 会抛异常的 typed client（try/catch 场景） */
export const api = createTypedClient<paths, '/api'>(request, '/api');

/** 永不抛异常、返回 `{ data, error, response }` 的 typed client（页面默认） */
export const flatApi = toFlatTypedClient<paths, '/api'>(request, '/api');

export default request;
