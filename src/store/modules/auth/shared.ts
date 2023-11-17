import { localStg } from '@/utils/storage';

/**
 * get token
 */
export function getToken() {
  return localStg.get('token') || '';
}

/**
 * get user info
 */
export function getUserInfo() {
  const emptyInfo: Api.Auth.UserInfo = {
    userId: '',
    userName: '',
    roles: []
  };
  const userInfo = localStg.get('userInfo') || emptyInfo;

  return userInfo;
}

/**
 * clear auth storage
 */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}
