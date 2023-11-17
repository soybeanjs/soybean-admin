import { request } from '../request';

/**
 * login
 * @param userName user name
 * @param password password
 */
export function fetchLogin(userName: string, password: string) {
  return request<App.Service.Response<Api.Auth.LoginToken>>('/auth/login', {
    method: 'post',
    body: {
      userName,
      password
    }
  });
}

/**
 * get user info
 */
export function fetchGetUserInfo() {
  return request<App.Service.Response<Api.Auth.UserInfo>>('/auth/getUserInfo');
}

/**
 * refresh token
 * @param refreshToken refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<App.Service.Response<Api.Auth.LoginToken>>('/auth/refreshToken', {
    method: 'post',
    body: {
      refreshToken
    }
  });
}
