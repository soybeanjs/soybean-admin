import { BACKEND_ERROR_FLAG, createRequest } from '@soybeanjs/fetch';
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

/**
 * 请求实例工厂（v3 §5.4 / P2-18）。
 *
 * 每一个 baseURL（主实例 + 每个 `/_p/{key}` 代理实例）都从这里创建，
 * **共享同一套钩子与模块级状态**：
 *
 * - envelope 解包 + 业务码判定（`transform` / `isBackendSuccess`）
 * - Bearer 注入
 * - 令牌过期 → 单飞刷新（模块级 `refreshPromise`）→ 原配置重放
 * - 错误提示去重（模块级 `lastErrorMessage` / `lastErrorAt`）
 *
 * 共享单飞与去重状态是刻意的：多个 baseURL 指向同一套账号体系时，
 * 并发过期只应触发一次刷新、只弹一次提示。
 */

/** 响应 envelope（所有 `/api/**` 恒为该结构，见后端 src/shared/response.ts） */
export interface ApiEnvelope<T = unknown> {
  code: string;
  message: string;
  data: T | null;
}

/** 对象守卫（运行时校验的基石，避免 unknown 上取属性的 as 断言） */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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
// 刷新令牌：独立裸实例（不走任何钩子，杜绝重入死循环）+ 模块级单飞
// ---------------------------------------------------------------------------

let refreshPromise: Promise<boolean> | null = null;

/**
 * 单飞刷新：并发过期只发一次 refresh，成功后本地凭据已更新。
 *
 * 刷新始终打在**主 baseURL**（账号体系在主服务上）；`/_p/{key}` 代理实例只是
 * 换后端数据源，不换身份中心。
 */
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
// 钩子
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

  // 全局提示由 toast 承接（SConfigProvider 已挂 Provider）；无 DOM 时静默
  if (typeof document !== 'undefined') {
    import('@vean/ui').then(({ toast }) => toast.error(message));
  }
}

// 第二泛型 `unknown`：DTO（ApiLoginResult 等）不是 envelope 形状，放开 `T extends ApiData` 约束，
// 让 `request.post<ApiLoginResult>(...)` 这类显式 DTO 泛型可用（响应已由 transform 解包）。
function createApiRequest(baseURL: string) {
  return createRequest<ApiEnvelope, unknown>(
    { baseURL },
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
      /**
       * 传输层错误（网络/超时/5xx）与**业务失败**共用同一入口。
       *
       * ⚠️ 业务失败必须跳过：`onBackendFail` 已经用后端 `message` 提示过，
       * 但 `@soybeanjs/fetch` 在 `onBackendFail` 返回空后仍会 `throw
       * new BackendError(backendErrorMsg)`，那条错误会再走一次本钩子。
       * 两处都提示的后果不只是「弹两次」—— 两条文案不同（后端 message
       * vs `backendErrorMsg` 的英文兜底），而 `notifyError` 的去重键是
       * **文案**，于是同一业务错误连发时永远命不中去重窗口，页面上会叠
       * 出 N 组双 toast。判据用包导出的 `BACKEND_ERROR_FLAG`（`error.code`
       * 即该值），不要去比对 message。
       */
      onError: (error: FetchError<ApiEnvelope>) => {
        if (error.code === BACKEND_ERROR_FLAG) return;

        notifyError(error.message || '网络异常，请稍后重试');
      }
    }
  );
}

/** 一个 baseURL 对应的三件套：裸实例 + 抛异常 typed client + 永不抛 typed client */
export interface ApiClients {
  request: ReturnType<typeof createApiRequest>;
  /** 会抛异常的 typed client（try/catch 场景） */
  api: ReturnType<typeof createTypedClient<paths, '/api'>>;
  /** 永不抛异常、返回 `{ data, error, response }` 的 typed client（页面默认） */
  flatApi: ReturnType<typeof toFlatTypedClient<paths, '/api'>>;
}

/**
 * 按 baseURL 造一套 client。
 *
 * - `baseURL` 为空走同源：dev 下 ubean 同进程 Hono，`/api/**` 直接命中；
 *   生产由反向代理/同域部署承接。
 * - 代理实例传 `/_p/{key}`，请求落到 `routeRules.proxy` 转发到对应上游。
 * - `paths` 来自 `.ubean/openapi.d.ts`（仓库唯一 API 类型源）；第二泛型 `'/api'`
 *   是后端挂载前缀，须与路由前缀一致，否则类型路径整体对不上。
 */
export function createApiClients(baseURL: string): ApiClients {
  const request = createApiRequest(baseURL);

  return {
    request,
    api: createTypedClient<paths, '/api'>(request, '/api'),
    flatApi: toFlatTypedClient<paths, '/api'>(request, '/api')
  };
}
