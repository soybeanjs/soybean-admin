import { EnumStorageKey } from '@/enum';
import type { LoginModuleType } from '@/interface';
import { setLocal, getLocal, removeLocal } from '../storage';

/** 设置token */
export function setToken(token: string) {
  setLocal(EnumStorageKey.token, token);
}

/** 获取token */
export function getToken() {
  return getLocal<string>(EnumStorageKey.token) || '';
}

/** 去除token */
export function removeToken() {
  removeLocal(EnumStorageKey.token);
}

/** 获取refresh token */
export function getRefreshToken() {
  return getLocal<string>(EnumStorageKey['refresh-koken']) || '';
}

/** 设置refresh token */
export function setRefreshToken(token: string) {
  setLocal(EnumStorageKey['refresh-koken'], token);
}

/** 去除refresh token */
export function removeRefreshToken() {
  removeLocal(EnumStorageKey['refresh-koken']);
}

export function getUserInfo() {}

/** 去除用户相关缓存 */
export function resetAuthStorage() {
  removeToken();
  removeRefreshToken();
}

/** 获取登录模块的正则字符串 */
export function getLoginModuleRegExp() {
  const arr: LoginModuleType[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];
  return arr.join('|');
}
