import type { AuthUserDTO, LoginResult } from '@/schema/auth';
import { getLocalJson, getLocal, removeLocal, setLocal, setLocalJson } from './storage';

/** 认证凭据的本地缓存与全局登出回调（v3 §5.5） 详见 docs/v3-notes.md N-285。 */

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

export function getLocalUserInfo(): AuthUserDTO | null {
  return getLocalJson<AuthUserDTO>(USER_INFO_KEY);
}

export function setLocalUserInfo(userInfo: AuthUserDTO): void {
  setLocalJson(USER_INFO_KEY, userInfo);
}

/** 清空凭据缓存（token 对 + 用户信息） */
export function clearAuthStorage(): void {
  removeLocal(TOKEN_KEY);
  removeLocal(REFRESH_TOKEN_KEY);
  removeLocal(USER_INFO_KEY);
}

/** 写入整对 token + 用户（登录/刷新成功后一次落齐） */
export function setAuthStorage(result: LoginResult): void {
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
 */
export function handleLogoutRequest(silent: boolean): void {
  if (logoutHandler) {
    logoutHandler(silent);
  }
}

type AuthResetHandler = () => void;

let authResetHandler: AuthResetHandler | null = null;

/**
 * 注册「登录态刚被清空」的收尾动作（守卫拿到 router 实例时注册）。
 * store 只清状态、不碰路由，跳登录页由回调完成，避免 store 依赖 `@/router`。
 */
export function setAuthResetHandler(handler: AuthResetHandler): void {
  authResetHandler = handler;
}

/** 由 `resetStore()` 在清完状态后调用；未注册时是空操作（单测环境即如此） */
export function handleAuthReset(): void {
  authResetHandler?.();
}
