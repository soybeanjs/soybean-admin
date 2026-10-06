import * as v from 'valibot';

/**
 * 认证域 DTO（v3 §6.3/§5.5）。
 * `AuthUserDTO` 是面向前端的用户安全视图（绝不含 password）。
 */

/** 用户安全视图（签发 token / user-info 返回） */
export type AuthUserDTO = {
  id: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  email: string | null;
  phone: string | null;
  homePath: string | null;
  description: string | null;
  enabled: 'Y' | 'N' | 'D';
  roles: string[];
};

/** 登录请求（pwd 密码登录 / captcha 图形验证码登录，v2 双类型契约） */
export const loginSchema = v.object({
  userName: v.pipe(v.string(), v.nonEmpty('用户名不能为空')),
  password: v.pipe(v.string(), v.nonEmpty('密码不能为空')),
  /** 登录类型：pwd 密码；captcha 验证码（配合 captchaId/captchaCode） */
  grantType: v.optional(v.picklist(['pwd', 'captcha']), 'pwd'),
  captchaId: v.optional(v.string()),
  captchaCode: v.optional(v.string())
});

export type LoginDTO = v.InferOutput<typeof loginSchema>;

/** 注册请求 */
export const registerSchema = v.object({
  userName: v.pipe(v.string(), v.minLength(3, '用户名至少 3 个字符')),
  password: v.pipe(v.string(), v.minLength(6, '密码至少 6 个字符')),
  email: v.optional(v.pipe(v.string(), v.email('邮箱格式不正确'))),
  fullName: v.optional(v.string())
});

export type RegisterDTO = v.InferOutput<typeof registerSchema>;

/** 刷新令牌请求 */
export const refreshTokenSchema = v.object({
  refreshToken: v.pipe(v.string(), v.nonEmpty('refreshToken 不能为空'))
});

export type RefreshTokenDTO = v.InferOutput<typeof refreshTokenSchema>;

/** 登录响应（token 对 + 用户安全视图） */
export type LoginResult = {
  token: string;
  refreshToken: string;
  user: AuthUserDTO;
};
