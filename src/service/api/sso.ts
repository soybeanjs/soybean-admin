import {requestCoco} from '../request';

export function fetchLoginSsoUrl(author: string) {
  return requestCoco<string>({
    url: `/auth/login/${author}`,
    method: 'get'
  });
}

export function doLoginSso(author: string, code: string, state: string) {
  return requestCoco<string>({
    url: `/auth/login/${author}/callback`,
    method: 'get',
    params: {
      code,
      state
    }
  });
}

export function doLogoutSso(author: string) {
  return requestCoco<string>({url: `/logout/${author}`});
}

export function fetchLoginSsoCheck(author: string) {
  return requestCoco<boolean>({url: `/auth/login/${author}/check`});
}

export function fetchSsoUserInfo(author: string) {
  return requestCoco<Api.Auth.UserInfo>({url: `/userInfo/${author}`});
}
