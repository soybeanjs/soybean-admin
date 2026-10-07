import request from '@/request';
import type { ApiLoginResult, ApiUserInfo } from '@/typings/app';

/**
 * 认证域 API（v3 §5.5）。
 *
 * openapi 200 响应未带 content schema，typed client 推不出响应体 ——
 * 响应类型经手写 DTO（`src/typings/app.d.ts`）+ 裸实例泛型补齐；
 * 路径仍与 `.ubean/openapi.d.ts` 对齐（改动会被 typecheck 抓住）。
 */

/** 用户名密码登录 */
export function fetchLogin(userName: string, password: string) {
  return request.post<ApiLoginResult>('/api/auth/login', { userName, password, grantType: 'pwd' });
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
