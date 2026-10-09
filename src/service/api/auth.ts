import request from '@/request';
import type { UpdateProfilePayload } from '@/schema/profile';
import type { ApiCaptcha, ApiLoginResult, ApiUserInfo, ApiWechatBinding, ApiWechatQrcode } from '@/typings/app';

/**
 * 认证域 API（v3 §5.5、§4.6）。
 *
 * openapi 200 响应未带 content schema，typed client 推不出响应体 ——
 * 响应类型经手写 DTO（`src/typings/app.d.ts`）+ 裸实例泛型补齐。
 */

/** 用户名密码登录（可选图形验证码，由服务端开关决定是否必需） */
export function fetchLogin(userName: string, password: string, captcha?: { captchaId: string; captchaCode: string }) {
  return request.post<ApiLoginResult>('/api/auth/login', {
    userName,
    password,
    grantType: 'pwd',
    ...(captcha?.captchaId && captcha.captchaCode ? captcha : {})
  });
}

/** 图形验证码登录（无短信通道，用图形验证码代替短信验证码） */
export function fetchLoginByCaptcha(userName: string, captchaId: string, captchaCode: string) {
  return request.post<ApiLoginResult>('/api/auth/login', {
    userName,
    captchaId,
    captchaCode,
    grantType: 'captcha'
  });
}

/** 注册（后端注册即登录，直接返回 token 对） */
export function fetchRegister(payload: { userName: string; password: string; email?: string; fullName?: string }) {
  return request.post<ApiLoginResult>('/api/auth/register', payload);
}

/** 获取图形验证码（答案服务端缓存、一次性消费） */
export function fetchCaptcha() {
  return request.get<ApiCaptcha>('/api/auth/captcha');
}

/** 重置密码（未登录态，凭图形验证码） */
export function fetchResetPassword(payload: {
  userName: string;
  password: string;
  captchaId: string;
  captchaCode: string;
}) {
  return request.post<null>('/api/auth/reset-password', payload);
}

/** 刷新令牌对 */
export function fetchRefreshToken(refreshToken: string) {
  return request.post<ApiLoginResult>('/api/auth/refresh-token', { refreshToken });
}

/** 获取当前登录用户信息 */
export function fetchGetUserInfo() {
  return request.get<ApiUserInfo>('/api/auth/user-info');
}

/** 登出（后端拉黑 token 对；请求层钩子会自动带上 Bearer） */
export function fetchLogout() {
  return request.post<null>('/api/auth/logout');
}

/** 获取微信绑定二维码（mock：无开放平台凭证，扫码由前端「模拟扫码」触发） */
export function fetchWechatQrcode() {
  return request.get<ApiWechatQrcode>('/api/auth/wechat-qrcode');
}

/** 查询当前用户微信绑定状态 */
export function fetchWechatBinding() {
  return request.get<ApiWechatBinding>('/api/auth/bind-wechat');
}

/** 完成微信绑定（mock：提交二维码 ticket） */
export function fetchBindWechat(ticket: string) {
  return request.post<ApiWechatBinding>('/api/auth/bind-wechat', { ticket });
}

/**
 * 更新当前登录用户的个人资料（P3-09 个人中心）。
 *
 * 走 `/api/auth/profile` 而不是 `/api/user/:id`：前者只允许改自己的展示字段
 * （`userId` 由服务端从 token 取），后者是管理员语义、需要 RBAC 权限码。
 */
export function fetchUpdateProfile(payload: UpdateProfilePayload) {
  return request.put<ApiUserInfo>('/api/auth/profile', payload);
}

/**
 * 修改当前登录用户的密码（服务端校验当前密码）。
 *
 * 成功后不主动登出：旧 token 仍有效，客户端想强制重新登录可以自行 `authStore.logout()`。
 */
export function fetchModifyPassword(payload: { currentPassword: string; newPassword: string }) {
  return request.post<null>('/api/auth/modify-password', payload);
}

/**
 * 错误归一演示（`/function/request`）。
 * 恒返回 HTTP 200 + 业务错误码（后端抛 `AppError`，全局错误中间件转 envelope）：
 * - 不传 `code` → `1000 SYSTEM_ERROR`（普通失败提示，3s 去重）
 * - `1000` → 同上（显式演示「普通错误」）、`8888` → 静默登出、`7777` → 弹窗登出、
 *   `9999` → 触发令牌刷新后重放（未登录访问会直接失败，属预期）
 */
export function fetchCustomBackendError(code?: string) {
  return request.post<null>('/api/auth/error', undefined, { query: code ? { code } : undefined });
}
