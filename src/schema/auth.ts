import {
  array,
  boolean,
  description,
  email,
  forward,
  integer,
  literal,
  minLength,
  nonEmpty,
  number,
  object,
  optional,
  partialCheck,
  pipe,
  string,
  union
} from 'valibot';
import type { InferOutput } from 'valibot';
import { enabledSchema, idSchema, rowText } from './_shared';

/**
 * 认证域 DTO（v3 §6.3/§5.5）。
 *
 * 同一份 Valibot 声明同时驱动服务端校验与登录页表单（P3-05 契约）：表单
 * schema 通过 `...serverSchema.entries` 复用服务端字段对象，错误消息必然同源。
 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 密码登录分支（可选携带图形验证码：两个都传才校验） */
export const pwdLoginSchema = object({
  grantType: optional(pipe(literal('pwd'), description('授权类型：密码登录'))),
  userName: pipe(string(), nonEmpty('用户名不能为空'), description('用户名')),
  password: pipe(string(), nonEmpty('密码不能为空'), description('登录密码')),
  captchaId: optional(pipe(string(), description('图形验证码标识，与 captchaCode 成对出现'))),
  captchaCode: optional(pipe(string(), description('图形验证码，与 captchaId 成对出现')))
});

/** 图形验证码登录分支 */
export const captchaLoginSchema = object({
  grantType: pipe(literal('captcha'), description('授权类型：图形验证码登录')),
  userName: pipe(string(), nonEmpty('用户名不能为空'), description('用户名')),
  captchaId: pipe(string(), nonEmpty('验证码标识不能为空'), description('图形验证码标识')),
  captchaCode: pipe(string(), nonEmpty('验证码不能为空'), description('图形验证码'))
});

/** 登录请求（密码登录 / 图形验证码登录，v2 双类型契约） */
export const loginSchema = union([pwdLoginSchema, captchaLoginSchema]);

/** 注册请求 */
export const registerSchema = object({
  userName: pipe(string(), minLength(3, '用户名至少 3 个字符'), description('用户名')),
  password: pipe(string(), minLength(6, '密码至少 6 个字符'), description('登录密码')),
  email: optional(pipe(string(), email('邮箱格式不正确'), description('邮箱，选填'))),
  fullName: optional(pipe(string(), description('姓名，选填')))
});

/** 刷新令牌请求 */
export const refreshTokenSchema = object({
  refreshToken: pipe(string(), nonEmpty('refreshToken 不能为空'), description('刷新令牌'))
});

/**
 * 重置密码请求（未登录，图形验证码代替短信验证码）。
 *
 * 无短信通道（demo 无短信服务商），重置凭证用图形验证码承担，语义与 v2
 * `reset-pwd` 页面一致（v2 用手机号 + 短信码）。
 */
export const resetPasswordSchema = object({
  userName: pipe(string(), nonEmpty('用户名不能为空'), description('用户名')),
  password: pipe(string(), minLength(6, '密码至少 6 个字符'), description('新密码')),
  captchaId: pipe(string(), nonEmpty('验证码标识不能为空'), description('图形验证码标识')),
  captchaCode: pipe(string(), nonEmpty('验证码不能为空'), description('图形验证码'))
});

/**
 * `POST /api/auth/error` 的演示码入参（P3-06）。
 *
 * `code` 只接受 `demoErrorCodeMap` 里登记的三个演示码，缺省（空串）回落到
 * `SYSTEM_ERROR`，让「请求演示页」能逐条触发请求层的四类分派
 * （静默登出 / 弹窗登出 / 刷新重放 / 普通报错）。
 */
export const demoErrorQuerySchema = object({
  code: optional(pipe(string(), description('演示错误码，留空回落 SYSTEM_ERROR')), '')
});

/** 微信绑定请求（已登录，凭二维码 ticket 完成绑定） */
export const bindWechatSchema = object({
  ticket: pipe(string(), nonEmpty('ticket 不能为空'), description('二维码 ticket'))
});

/* -------------------------------------------------------------------------- */
/*                          登录页表单（P3-05）                                */
/* -------------------------------------------------------------------------- */

/**
 * 登录页表单 schema 是**服务端 schema 的超集**：`useForm`（`@vean/ui`）直接吃
 * valibot（Standard Schema），前端不再手写「非空 / 长度 / 邮箱格式」这套重复
 * 校验 —— 只保留服务端没有的「确认密码一致」。
 *
 * **字段名与类型必须宽兼容服务端 schema**：`useForm` 用
 * `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，一旦引入
 * `undefined` 成员（`v.optional(…)` 且无默认值）会整体退化成 `never[]`，
 * `SFormField` 的 `name` 与插槽类型随之失效。所以这里一律「每个键都有值」，
 * 用空串表达「未填 / 未用」；提交前折算成 DTO 时再把空串去掉。
 */

/** 密码登录表单（服务端 `pwdLoginSchema` 的 pwd 分支） */
export const passwordLoginFormSchema = object({
  ...pwdLoginSchema.entries,
  // 覆盖服务端的 optional 成员：表单里总有值（空串 = 未用）
  captchaId: pipe(string(), description('图形验证码标识，未启用时为空串')),
  captchaCode: pipe(string(), description('图形验证码，未启用时为空串'))
});

/** 图形验证码登录表单（服务端 `captchaLoginSchema`） */
export const codeLoginFormSchema = object({ ...captchaLoginSchema.entries });

/**
 * 注册表单（服务端 `registerSchema` + 确认密码）。
 *
 * `email` 服务端是 `v.optional(...)`，表单里放宽成 `v.string()`（空串 = 未填）
 * —— 这样「不填邮箱」不再触发邮箱格式错误，提交前 `|| undefined` 归一后再交给
 * 服务端同一份规则。
 *
 * 「两次密码一致」是服务端没有的规则，用 `v.forward` + `v.partialCheck` 把
 * issue 挂到 `confirmPassword` 字段上（无字段路径的 issue 会落到 `_form` 键，
 * 弹窗/表单里没地方渲染）。
 */
export const registerFormSchema = pipe(
  object({
    ...registerSchema.entries,
    email: pipe(string(), description('邮箱，留空表示不填')),
    fullName: pipe(string(), description('姓名，留空表示不填')),
    confirmPassword: pipe(string(), description('确认密码，需与密码一致'))
  }),
  forward(
    partialCheck(
      [['password'], ['confirmPassword']],
      values => values.password === values.confirmPassword,
      '两次输入的密码不一致'
    ),
    ['confirmPassword']
  )
);

/** 重置密码表单（服务端 `resetPasswordSchema` + 确认密码，同上） */
export const resetPasswordFormSchema = pipe(
  object({
    ...resetPasswordSchema.entries,
    confirmPassword: pipe(string(), description('确认密码，需与密码一致'))
  }),
  forward(
    partialCheck(
      [['password'], ['confirmPassword']],
      values => values.password === values.confirmPassword,
      '两次输入的密码不一致'
    ),
    ['confirmPassword']
  )
);

/** 登录页 4 个表单模块的 schema 清单（`test/specs/schema/login-form.test.ts` 用） */
export const LOGIN_PAGE_FORM_SCHEMAS = {
  pwdLogin: passwordLoginFormSchema,
  codeLogin: codeLoginFormSchema,
  register: registerFormSchema,
  resetPwd: resetPasswordFormSchema
} as const;

/* -------------------------------------------------------------------------- */
/*                              表单默认值（P3-05）                            */
/* -------------------------------------------------------------------------- */

/**
 * `@vean/ui` 的 `useForm` 以 `defaultValues` 为基准（`handleReset` 也回这里），
 * 与各 manage 域的 `emptyXxxForm` 同一套路。
 *
 * 演示账号预填：密码登录带 `admin` / `123456`（与 v2 一致），其余留空。
 */

/** 密码登录默认值（演示账号预填） */
export const passwordLoginDefaults: PasswordLoginFormValues = {
  grantType: 'pwd',
  userName: 'admin',
  password: '123456',
  captchaId: '',
  captchaCode: ''
};

/** 图形验证码登录默认值 */
export const codeLoginDefaults: CodeLoginFormValues = {
  grantType: 'captcha',
  userName: 'admin',
  captchaId: '',
  captchaCode: ''
};

/** 注册默认值 */
export const registerDefaults: RegisterFormValues = {
  userName: '',
  password: '',
  email: '',
  fullName: '',
  confirmPassword: ''
};

/** 重置密码默认值 */
export const resetPasswordDefaults: ResetPasswordFormValues = {
  userName: '',
  password: '',
  captchaId: '',
  captchaCode: '',
  confirmPassword: ''
};

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 用户安全视图（签发 token / user-info 返回，绝不含 password） */
export const authUserSchema = object({
  id: idSchema,
  username: pipe(string(), description('用户名，全局唯一')),
  fullName: rowText('姓名'),
  avatar: rowText('头像地址'),
  email: rowText('邮箱'),
  phone: rowText('手机号'),
  homePath: rowText('登录后跳转的首页路径'),
  description: rowText('备注说明'),
  enabled: enabledSchema,
  roles: pipe(array(string()), description('角色码列表（粗粒度，做路由 / 菜单级判定）')),
  /**
   * 按钮级权限码列表（v3 §4.6：`userInfo.buttons` + `hasAuth(code)` + `v-auth`）。
   *
   * 与 `roles` 的分工：`roles` 是角色码（粗粒度、做路由/菜单级判定），
   * `buttons` 是权限码（细粒度、做按钮级判定）。超级管理员拿到全量权限码，
   * 前端只需按 `buttons.includes(code)` 判定，不再逐个角色推导。
   */
  buttons: pipe(array(string()), description('按钮级权限码列表（细粒度，做按钮级判定）'))
});

/** 登录 / 注册 / 刷新令牌响应（token 对 + 用户安全视图） */
export const loginResultSchema = object({
  token: pipe(string(), description('访问令牌（Authorization: Bearer）')),
  refreshToken: pipe(string(), description('刷新令牌，有效期 7 天')),
  user: authUserSchema
});

/** 图形验证码（`GET /api/auth/captcha` 响应） */
export const captchaResultSchema = object({
  captchaId: pipe(string(), description('验证码标识，登录 / 重置密码时回传')),
  img: pipe(string(), description('验证码图片（SVG data URL）'))
});

/** 微信绑定二维码（`GET /api/auth/wechat-qrcode` 响应） */
export const wechatQrcodeSchema = object({
  ticket: pipe(string(), description('二维码 ticket，绑定请求回传')),
  url: pipe(string(), description('授权 url（mock）')),
  expiresIn: pipe(number(), integer(), description('二维码有效期（秒）'))
});

/** 微信绑定状态（`GET` / `POST /api/auth/bind-wechat` 响应） */
export const wechatBindingSchema = object({
  bound: pipe(boolean(), description('是否已绑定微信')),
  nickname: rowText('微信昵称，未绑定时为 null')
});

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

/** 用户安全视图（签发 token / user-info 返回，绝不含 password） */
export type AuthUserDTO = InferOutput<typeof authUserSchema>;

/** 登录响应（token 对 + 用户安全视图） */
export type LoginResult = InferOutput<typeof loginResultSchema>;

export type CaptchaResult = InferOutput<typeof captchaResultSchema>;
export type WechatQrcode = InferOutput<typeof wechatQrcodeSchema>;
export type WechatBinding = InferOutput<typeof wechatBindingSchema>;

export type LoginDTO = InferOutput<typeof loginSchema>;
export type RegisterDTO = InferOutput<typeof registerSchema>;
export type RefreshTokenDTO = InferOutput<typeof refreshTokenSchema>;
export type ResetPasswordDTO = InferOutput<typeof resetPasswordSchema>;
export type DemoErrorQueryDTO = InferOutput<typeof demoErrorQuerySchema>;
export type BindWechatDTO = InferOutput<typeof bindWechatSchema>;
export type PasswordLoginFormValues = InferOutput<typeof passwordLoginFormSchema>;
export type CodeLoginFormValues = InferOutput<typeof codeLoginFormSchema>;
export type RegisterFormValues = InferOutput<typeof registerFormSchema>;
export type ResetPasswordFormValues = InferOutput<typeof resetPasswordFormSchema>;

/** 登录页 4 个表单模块的 schema 名（`LOGIN_PAGE_FORM_SCHEMAS` 的键） */
export type LoginPageFormName = keyof typeof LOGIN_PAGE_FORM_SCHEMAS;
