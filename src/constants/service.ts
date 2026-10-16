import {
  SERVICE_EXPIRED_TOKEN_CODES as ENV_SERVICE_EXPIRED_TOKEN_CODES,
  SERVICE_LOGOUT_CODES as ENV_SERVICE_LOGOUT_CODES,
  SERVICE_MODAL_LOGOUT_CODES as ENV_SERVICE_MODAL_LOGOUT_CODES,
  SERVICE_SUCCESS_CODE as ENV_SERVICE_SUCCESS_CODE,
  STATIC_SUPER_ROLE as ENV_STATIC_SUPER_ROLE
} from 'ubean:env/client';

/** 与服务端 `src/constants/error-code.ts` 对齐： 详见 docs/v3-notes.md N-282。 */

/** 逗号分隔码表 → 数组（去空项） */
function parseCodes(raw: string): string[] {
  return raw
    .split(',')
    .map(code => code.trim())
    .filter(Boolean);
}

/** 后端业务成功码 */
export const SERVICE_SUCCESS_CODE = ENV_SERVICE_SUCCESS_CODE;

/** 收到即静默登出的业务码 */
export const SERVICE_LOGOUT_CODES = parseCodes(ENV_SERVICE_LOGOUT_CODES);

/** 收到即弹窗确认后登出的业务码（登出码的子集） */
export const SERVICE_MODAL_LOGOUT_CODES = parseCodes(ENV_SERVICE_MODAL_LOGOUT_CODES);

/** 令牌过期码（可刷新重放） */
export const SERVICE_EXPIRED_TOKEN_CODES = parseCodes(ENV_SERVICE_EXPIRED_TOKEN_CODES);

/** static 权限模式下的超级角色码 */
export const STATIC_SUPER_ROLE = ENV_STATIC_SUPER_ROLE;
