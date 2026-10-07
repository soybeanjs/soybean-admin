import { env } from '@/env';

/**
 * 请求层业务码配置（v3 §5.4，来自 `.env` 的 `VITE_SERVICE_*`）。
 *
 * 与服务端 `src/constants/error-code.ts` 对齐：
 * - `0000` 成功；
 * - `2001` 令牌过期 → 单飞刷新 + 重放；
 * - `2000/2002/2003` 未授权类 → 弹窗确认后登出；
 * - 其余登出码 → 静默登出。
 */

/** 逗号分隔码表 → 数组（去空项） */
function parseCodes(raw: string): string[] {
  return raw
    .split(',')
    .map(code => code.trim())
    .filter(Boolean);
}

/** 后端业务成功码 */
export const SERVICE_SUCCESS_CODE = env.serviceSuccessCode;

/** 收到即静默登出的业务码 */
export const SERVICE_LOGOUT_CODES = parseCodes(env.serviceLogoutCodes);

/** 收到即弹窗确认后登出的业务码（登出码的子集） */
export const SERVICE_MODAL_LOGOUT_CODES = parseCodes(env.serviceModalLogoutCodes);

/** 令牌过期码（可刷新重放） */
export const SERVICE_EXPIRED_TOKEN_CODES = parseCodes(env.serviceExpiredTokenCodes);

/** static 权限模式下的超级角色码 */
export const STATIC_SUPER_ROLE = env.staticSuperRole;
