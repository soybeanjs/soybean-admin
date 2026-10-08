import type { CodeLoginFormValues, PasswordLoginFormValues, RegisterFormValues, ResetPasswordFormValues } from './auth';

/**
 * 登录页表单默认值（P3-05）。
 *
 * `@vean/ui` 的 `useForm` 以 `defaultValues` 为基准（`handleReset` 也回这里），
 * 与 `src/schema/form-defaults.ts` 同一套路。
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
