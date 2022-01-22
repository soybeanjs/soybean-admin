import { mockRequest } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param phone - 手机号
 * @param pwdOrCode - 密码或验证码
 * @param type - 登录方式: pwd - 密码登录; sms - 验证码登录
 */
export function fetchLogin(phone: string, pwdOrCode: string, type: 'pwd' | 'sms') {
  if (type === 'pwd') {
    return mockRequest.post<ApiAuth.Token>('/loginByPwd', { phone, pwd: pwdOrCode });
  }
  return mockRequest.post<ApiAuth.Token>('/loginByCode', { phone, code: pwdOrCode });
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

export function fetchTestToken() {
  return mockRequest.post('/testToken', { userName: 'Soybean' });
}

export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post('/updateToken', { refreshToken });
}
