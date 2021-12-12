/** 登录token */
export interface LoginToken {
  /** token */
  token: string;
  /** 刷新token(用户token到期后换取新的token) */
  refreshToken: string;
}

/** 用户信息 */
export interface UserInfo {
  /** 用户id */
  userId: string;
  /** 用户名 */
  userName: string;
  /** 用户手机号 */
  userPhone: string;
}
