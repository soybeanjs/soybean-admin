import { describe, expect, it } from 'vitest';
import * as v from 'valibot';
import type { BaseIssue, BaseSchema } from 'valibot';
import {
  captchaLoginSchema,
  codeLoginFormSchema,
  LOGIN_PAGE_FORM_SCHEMAS,
  passwordLoginFormSchema,
  pwdLoginSchema,
  registerFormSchema,
  registerSchema,
  resetPasswordFormSchema,
  resetPasswordSchema
} from './auth';
import {
  codeLoginDefaults,
  passwordLoginDefaults,
  registerDefaults,
  resetPasswordDefaults
} from './login-form-defaults';

/**
 * P3-05 的核心契约：**登录页表单与服务端共用同一份 valibot 声明**。
 *
 * 断言的是「同一份规则」而非「两份长得像」：表单 schema 通过
 * `...serverSchema.entries` 复用服务端字段对象，所以同一条错误消息必然同源。
 *
 * 每个用例都喂**完整对象**（缺键会先报 `Invalid key: Expected …`，把字段规则
 * 的比较淹掉）。
 */

/** 收集 issue 的 message */
function issueMessages(schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>, input: unknown): string[] {
  const result = v.safeParse(schema, input);

  return result.success ? [] : result.issues.map(issue => issue.message);
}

/** 收集 issue 的字段路径（第一段 key） */
function issueKeys(schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>, input: unknown): string[] {
  const result = v.safeParse(schema, input);

  if (result.success) return [];

  return result.issues.map(issue => String(issue.path?.[0]?.key ?? '_form'));
}

describe('登录页表单 schema = 服务端 schema 的超集', () => {
  it('密码登录：客户端与服务端对空用户名/空密码给出同一条消息', () => {
    const values = { ...passwordLoginDefaults, userName: '', password: '' };

    expect(issueMessages(passwordLoginFormSchema, values)).toEqual(issueMessages(pwdLoginSchema, values));
    expect(issueMessages(passwordLoginFormSchema, values)).toEqual(['用户名不能为空', '密码不能为空']);
  });

  it('图形验证码登录：客户端与服务端对空验证码给出同一条消息', () => {
    const values = { ...codeLoginDefaults, captchaId: '', captchaCode: '' };

    expect(issueMessages(codeLoginFormSchema, values)).toEqual(issueMessages(captchaLoginSchema, values));
    expect(issueMessages(codeLoginFormSchema, values)).toEqual(['验证码标识不能为空', '验证码不能为空']);
  });

  it('注册：用户名/密码长度规则与服务端一致', () => {
    const values = { ...registerDefaults, userName: 'ab', password: '123', confirmPassword: '123', email: 'a@b.com' };

    expect(issueMessages(registerFormSchema, values)).toEqual(issueMessages(registerSchema, values));
    expect(issueMessages(registerFormSchema, values)).toEqual(['用户名至少 3 个字符', '密码至少 6 个字符']);
  });

  it('注册：空邮箱在表单侧放行（未填），服务端侧才会报格式错', () => {
    const values = { ...registerDefaults, userName: 'admin', password: '123456', confirmPassword: '123456', email: '' };

    expect(issueMessages(registerFormSchema, values)).toEqual([]);
    expect(issueMessages(registerSchema, values)).toContain('邮箱格式不正确');
  });

  it('注册/重置密码：两次密码不一致的 issue 挂在 confirmPassword 上（不是 _form）', () => {
    const registerValues = { ...registerDefaults, userName: 'admin', password: '123456', confirmPassword: 'x' };

    expect(issueMessages(registerFormSchema, registerValues)).toEqual(['两次输入的密码不一致']);
    expect(issueKeys(registerFormSchema, registerValues)).toEqual(['confirmPassword']);

    const resetValues = {
      ...resetPasswordDefaults,
      userName: 'admin',
      password: '123456',
      confirmPassword: 'x',
      captchaId: 'cap',
      captchaCode: '1234'
    };

    expect(issueMessages(resetPasswordFormSchema, resetValues)).toEqual(['两次输入的密码不一致']);
    expect(issueKeys(resetPasswordFormSchema, resetValues)).toEqual(['confirmPassword']);
  });

  it('重置密码：字段规则直接复用服务端 resetPasswordSchema', () => {
    const values = { ...resetPasswordDefaults, userName: '', password: '' };

    expect(issueMessages(resetPasswordFormSchema, values)).toEqual(issueMessages(resetPasswordSchema, values));
    expect(issueMessages(resetPasswordFormSchema, values)).toEqual([
      '用户名不能为空',
      '密码至少 6 个字符',
      '验证码标识不能为空',
      '验证码不能为空'
    ]);
  });
});

describe('登录页表单默认值', () => {
  it('默认值形态正确：已填默认值通过，空表只在必填字段报错', () => {
    // 密码登录预填演示账号，开箱即通过
    expect(issueMessages(passwordLoginFormSchema, passwordLoginDefaults)).toEqual([]);

    // 空表：必填字段报错，可选字段（邮箱/姓名）不报错
    expect(issueMessages(registerFormSchema, registerDefaults)).toEqual(['用户名至少 3 个字符', '密码至少 6 个字符']);
    expect(issueMessages(resetPasswordFormSchema, resetPasswordDefaults)).toEqual([
      '用户名不能为空',
      '密码至少 6 个字符',
      '验证码标识不能为空',
      '验证码不能为空'
    ]);
    // 图形验证码登录的验证码由拉取结果回写，默认值只有用户名
    expect(issueMessages(codeLoginFormSchema, codeLoginDefaults)).toEqual(['验证码标识不能为空', '验证码不能为空']);
  });

  it('默认值键集合与 schema 键集合一致（不多不少）', () => {
    const cases = [
      [passwordLoginFormSchema, passwordLoginDefaults],
      [codeLoginFormSchema, codeLoginDefaults],
      [registerFormSchema, registerDefaults],
      [resetPasswordFormSchema, resetPasswordDefaults]
    ] as const;

    for (const [schema, defaults] of cases) {
      expect(Object.keys(defaults).sort()).toEqual(Object.keys(schema.entries).sort());
    }
  });

  it('LOGIN_PAGE_FORM_SCHEMAS 覆盖 4 个纯表单模块', () => {
    expect(Object.keys(LOGIN_PAGE_FORM_SCHEMAS).sort()).toEqual(['codeLogin', 'pwdLogin', 'register', 'resetPwd']);
  });
});
