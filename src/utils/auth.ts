import type { ApiLoginResult, ApiUserInfo } from '@/typings/app';
import { getLocalJson, getLocal, removeLocal, setLocal, setLocalJson } from './storage';

/**
 * 认证凭据的本地缓存与全局登出回调（v3 §5.5）。
 *
 * 请求层（`src/request`）与 auth store（`src/store/modules/auth`）互相依赖会造成
 * 循环引用 —— 请求层只碰这里：同步的 token 存取 + 由 store 在启动时注册的
 * `handleLogout` 回调。store 负责真正的状态重置与跳转。
 */

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

export function getLocalToken(): string {
  return getLocal(TOKEN_KEY) ?? '';
}

export function setLocalToken(token: string): void {
  setLocal(TOKEN_KEY, token);
}

export function getLocalRefreshToken(): string {
  return getLocal(REFRESH_TOKEN_KEY) ?? '';
}

export function setLocalRefreshToken(refreshToken: string): void {
  setLocal(REFRESH_TOKEN_KEY, refreshToken);
}

export function getLocalUserInfo(): ApiUserInfo | null {
  return getLocalJson<ApiUserInfo>(USER_INFO_KEY);
}

export function setLocalUserInfo(userInfo: ApiUserInfo): void {
  setLocalJson(USER_INFO_KEY, userInfo);
}

/** 清空凭据缓存（token 对 + 用户信息） */
export function clearAuthStorage(): void {
  removeLocal(TOKEN_KEY);
  removeLocal(REFRESH_TOKEN_KEY);
  removeLocal(USER_INFO_KEY);
}

/** 写入整对 token + 用户（登录/刷新成功后一次落齐） */
export function setAuthStorage(result: ApiLoginResult): void {
  setLocalToken(result.token);
  setLocalRefreshToken(result.refreshToken);
  setLocalUserInfo(result.user);
}

type LogoutHandler = (silent: boolean) => void;

let logoutHandler: LogoutHandler | null = null;

/** auth store 启动时注册登出回调（避免请求层 → store 循环引用） */
export function setLogoutHandler(handler: LogoutHandler): void {
  logoutHandler = handler;
}

/**
 * 请求层统一登出入口。
 *
 * @param silent true = 不弹确认框直接登出（刷新失败/登出码）；false = 走 store 的弹窗确认
 */
export function handleLogoutRequest(silent: boolean): void {
  if (logoutHandler) {
    logoutHandler(silent);
  }
}
