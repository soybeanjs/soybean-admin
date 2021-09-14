import { EnumStorageKey } from '@/enum';
import type { LoginModuleType } from '@/interface';
import { setLocal, getLocal, removeLocal } from '../storage';

/** 设置token */
export function getToken() {
  return getLocal<string>(EnumStorageKey.token) || '';
}

/** 获取token */
export function setToken(token: string) {
  setLocal(EnumStorageKey.token, token);
}

export function removeToken() {
  removeLocal(EnumStorageKey.token);
}

export function getUserInfo() {}

/** 获取登录模块的正则字符串 */
export function getLoginModuleRegExp() {
  const arr: LoginModuleType[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];
  return arr.join('|');
}
