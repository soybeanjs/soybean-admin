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
  /**
   * 按钮级权限码列表（v3 §4.6：`userInfo.buttons` + `hasAuth(code)` + `v-auth`）。
   *
   * 与 `roles` 的分工：`roles` 是角色码（粗粒度、做路由/菜单级判定），
   * `buttons` 是权限码（细粒度、做按钮级判定）。超级管理员拿到全量权限码，
   * 前端只需按 `buttons.includes(code)` 判定，不再逐个角色推导。
   */
  buttons: string[];
};

/** 密码登录分支（可选携带图形验证码：两个都传才校验） */
export const pwdLoginSchema = v.object({
  grantType: v.optional(v.literal('pwd')),
  userName: v.pipe(v.string(), v.nonEmpty('用户名不能为空')),
  password: v.pipe(v.string(), v.nonEmpty('密码不能为空')),
  captchaId: v.optional(v.string()),
  captchaCode: v.optional(v.string())
});

/** 图形验证码登录分支 */
export const captchaLoginSchema = v.object({
  grantType: v.literal('captcha'),
  userName: v.pipe(v.string(), v.nonEmpty('用户名不能为空')),
  captchaId: v.pipe(v.string(), v.nonEmpty('验证码标识不能为空')),
  captchaCode: v.pipe(v.string(), v.nonEmpty('验证码不能为空'))
});

/** 登录请求（pwd 密码登录 / captcha 图形验证码登录，v2 双类型契约） */
export const loginSchema = v.union([pwdLoginSchema, captchaLoginSchema]);

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

/**
 * 重置密码请求（未登录，图形验证码代替短信验证码）。
 *
 * 无短信通道（demo 无短信服务商），重置凭证用图形验证码承担，语义与 v2
 * `reset-pwd` 页面一致（v2 用手机号 + 短信码）。
 */
export const resetPasswordSchema = v.object({
  userName: v.pipe(v.string(), v.nonEmpty('用户名不能为空')),
  password: v.pipe(v.string(), v.minLength(6, '密码至少 6 个字符')),
  captchaId: v.pipe(v.string(), v.nonEmpty('验证码标识不能为空')),
  captchaCode: v.pipe(v.string(), v.nonEmpty('验证码不能为空'))
});

export type ResetPasswordDTO = v.InferOutput<typeof resetPasswordSchema>;

/**
 * `POST /api/auth/error` 的演示码入参（P3-06）。
 *
 * `code` 只接受 `demoErrorCodeMap` 里登记的三个演示码，缺省（空串）回落到
 * `SYSTEM_ERROR`，让「请求演示页」能逐条触发请求层的四类分派
 * （静默登出 / 弹窗登出 / 刷新重放 / 普通报错）。
 */
export const demoErrorQuerySchema = v.object({
  code: v.optional(v.string(), '')
});

export type DemoErrorQueryDTO = v.InferOutput<typeof demoErrorQuerySchema>;

/** 微信绑定请求（已登录，凭二维码 ticket 完成绑定） */
export const bindWechatSchema = v.object({
  ticket: v.pipe(v.string(), v.nonEmpty('ticket 不能为空'))
});

export type BindWechatDTO = v.InferOutput<typeof bindWechatSchema>;

/** 登录响应（token 对 + 用户安全视图） */
export type LoginResult = {
  token: string;
  refreshToken: string;
  user: AuthUserDTO;
};

/* -------------------------------------------------------------------------- */
/*                          登录页表单（P3-05）                                */
/* -------------------------------------------------------------------------- */

/**
 * 登录页表单 schema。
 *
 * 它们是**服务端 schema 的超集**，同一份 valibot 声明同时驱动两端（P3-05
 * 契约）：`useForm`（`@vean/ui`）直接吃 valibot（Standard Schema），前端不再
 * 手写「非空 / 长度 / 邮箱格式」这套重复校验 —— 只保留服务端没有的
 * 「确认密码一致」。
 *
 * **字段名与类型必须宽兼容服务端 schema**：`useForm` 用
 * `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，一旦引入
 * `undefined` 成员（`v.optional(…)` 且无默认值）会整体退化成 `never[]`，
 * `SFormField` 的 `name` 与插槽类型随之失效。所以这里一律「每个键都有值」，
 * 用空串表达「未填 / 未用」；提交前折算成 DTO 时再把空串去掉。
 */

/** 密码登录表单（服务端 `loginSchema` 的 pwd 分支） */
export const passwordLoginFormSchema = v.object({
  ...pwdLoginSchema.entries,
  // 覆盖服务端的 optional 成员：表单里总有值（空串 = 未用）
  captchaId: v.string(),
  captchaCode: v.string()
});

export type PasswordLoginFormValues = v.InferOutput<typeof passwordLoginFormSchema>;

/** 图形验证码登录表单（服务端 `loginSchema` 的 captcha 分支） */
export const codeLoginFormSchema = v.object({
  ...captchaLoginSchema.entries
});

export type CodeLoginFormValues = v.InferOutput<typeof codeLoginFormSchema>;

/**
 * 注册表单（服务端 `registerSchema` + 确认密码）。
 *
 * `email` 服务端是 `v.optional(...)`，表单里放宽成 `v.string()`（空串 =
 * 未填）—— 这样「不填邮箱」不再触发邮箱格式错误，提交前 `|| undefined`
 * 归一后再交给服务端同一份规则。
 *
 * 「两次密码一致」是服务端没有的规则，用 `v.forward` + `v.partialCheck`
 * 把 issue 挂到 `confirmPassword` 字段上（无字段路径的 issue 会落到 `_form`
 * 键，弹窗/表单里没地方渲染）。
 */
export const registerFormSchema = v.pipe(
  v.object({
    ...registerSchema.entries,
    email: v.string(),
    fullName: v.string(),
    confirmPassword: v.string()
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      values => values.password === values.confirmPassword,
      '两次输入的密码不一致'
    ),
    ['confirmPassword']
  )
);

export type RegisterFormValues = v.InferOutput<typeof registerFormSchema>;

/** 重置密码表单（服务端 `resetPasswordSchema` + 确认密码，同上） */
export const resetPasswordFormSchema = v.pipe(
  v.object({
    ...resetPasswordSchema.entries,
    confirmPassword: v.string()
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      values => values.password === values.confirmPassword,
      '两次输入的密码不一致'
    ),
    ['confirmPassword']
  )
);

export type ResetPasswordFormValues = v.InferOutput<typeof resetPasswordFormSchema>;

/** 登录页 4 个表单模块的 schema 清单（`src/schema/login-form.test.ts` 用） */
export const LOGIN_PAGE_FORM_SCHEMAS = {
  pwdLogin: passwordLoginFormSchema,
  codeLogin: codeLoginFormSchema,
  register: registerFormSchema,
  resetPwd: resetPasswordFormSchema
} as const;
