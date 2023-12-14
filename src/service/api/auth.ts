import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
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

/** Get user info */
export function fetchGetUserInfo() {
  return request<App.Service.Response<Api.Auth.UserInfo>>('/auth/getUserInfo');
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<App.Service.Response<Api.Auth.LoginToken>>('/auth/refreshToken', {
    method: 'post',
    body: {
      refreshToken
    }
  });
}
