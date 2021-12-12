import { EnumStorageKey } from '@/enum';
import type { UserInfo } from '@/interface';
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

/** 设置用户信息 */
export function getUserInfo() {
  const emptyInfo: UserInfo = {
    userId: '',
    userName: '',
    userPhone: ''
  };
  const userInfo: UserInfo = getLocal<UserInfo>(EnumStorageKey['user-info']) || emptyInfo;
  return userInfo;
}
/** 获取用户信息 */
export function setUserInfo(userInfo: UserInfo) {
  setLocal(EnumStorageKey['user-info'], userInfo);
}
/** 去除用户信息 */
export function removeUserInfo() {
  removeLocal(EnumStorageKey['user-info']);
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  removeToken();
  removeRefreshToken();
  removeUserInfo();
}
