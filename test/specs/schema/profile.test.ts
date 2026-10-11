import { describe, expect, it } from 'vitest';
import * as v from 'valibot';
import {
  EMAIL_PATTERN,
  EMPTY_PASSWORD_FORM,
  EMPTY_PROFILE_FORM,
  PHONE_PATTERN,
  changePasswordFormSchema,
  profileFormSchema,
  profileUpdateSchema,
  toProfileFormValues,
  toUpdateProfilePayload
} from '@/schema/profile';

/**
 * 个人中心表单契约测试（P3-09）。
 *
 * 重点不是「valibot 能跑」，而是两条本项目特有的约定：
 * 1. **空串合法**：表单里留空 = 清空该字段，不能在格式校验上被拦（邮箱/手机号）；
 * 2. **前后端共用同一份规则**：`profileUpdateSchema` 就是
 *    `src/routes/api/auth/profile.ts` 的 `validate('json', ...)` 入参，
 *    这里断言它的行为与表单侧一致。
 */

/** 收集校验失败的首条 message（成功时返回 null） */
function firstIssue(schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, input: unknown): string | null {
  const result = v.safeParse(schema, input);

  return result.success ? null : (result.issues[0]?.message ?? '');
}

describe('profileUpdateSchema（PUT /api/auth/profile 的服务端 schema）', () => {
  it('全空对象合法（所有字段可选）', () => {
    expect(v.safeParse(profileUpdateSchema, {}).success).toBe(true);
  });

  it('null 合法（清空字段）', () => {
    const result = v.safeParse(profileUpdateSchema, {
      fullName: null,
      email: null,
      phone: null,
      homePath: null,
      description: null
    });

    expect(result.success).toBe(true);
  });

  it('空串合法（不该在格式校验上被拦）', () => {
    expect(v.safeParse(profileUpdateSchema, { email: '', phone: '' }).success).toBe(true);
  });

  it('合法邮箱与手机号通过', () => {
    const result = v.safeParse(profileUpdateSchema, { email: 'a@b.com', phone: '+86 138-0000-0000' });

    expect(result.success).toBe(true);
  });

  it('非法邮箱给出「邮箱格式不正确」', () => {
    expect(firstIssue(profileUpdateSchema, { email: 'not-an-email' })).toBe('邮箱格式不正确');
  });

  it('非法手机号给出「手机号格式不正确」', () => {
    expect(firstIssue(profileUpdateSchema, { phone: 'abc' })).toBe('手机号格式不正确');
  });

  it('不含 password / enabled / roleIds —— 个人中心不能改状态与角色', () => {
    // valibot 的 object schema 默认剥掉未知键，所以额外传也不会流入 DTO
    const result = v.safeParse(profileUpdateSchema, { password: 'x', enabled: 'N', roleIds: ['R_x'] });
    const parsed: Record<string, unknown> = result.success ? { ...result.output } : {};

    expect(parsed.password).toBeUndefined();
    expect(parsed.enabled).toBeUndefined();
    expect(parsed.roleIds).toBeUndefined();
  });
});

describe('profileFormSchema（表单侧）', () => {
  it('空表单合法', () => {
    expect(v.safeParse(profileFormSchema, EMPTY_PROFILE_FORM).success).toBe(true);
  });

  it('空串放行，非法格式拦截', () => {
    expect(v.safeParse(profileFormSchema, { ...EMPTY_PROFILE_FORM, email: '' }).success).toBe(true);
    expect(v.safeParse(profileFormSchema, { ...EMPTY_PROFILE_FORM, email: 'x@' }).success).toBe(false);
  });

  it('与 profileUpdateSchema 共用同一个正则', () => {
    expect(EMAIL_PATTERN.test('user@example.com')).toBe(true);
    expect(EMAIL_PATTERN.test('user@example')).toBe(false);
    expect(PHONE_PATTERN.test('13800000000')).toBe(true);
    expect(PHONE_PATTERN.test('123')).toBe(false);
  });
});

describe('changePasswordFormSchema（跨字段一致）', () => {
  it('两次密码一致时合法', () => {
    const result = v.safeParse(changePasswordFormSchema, {
      currentPassword: 'old-pass',
      newPassword: 'new-pass',
      confirmPassword: 'new-pass'
    });

    expect(result.success).toBe(true);
  });

  it('两次密码不一致时错误落在 confirmPassword 上', () => {
    const result = v.safeParse(changePasswordFormSchema, {
      currentPassword: 'old-pass',
      newPassword: 'new-pass',
      confirmPassword: 'other'
    });

    expect(result.success).toBe(false);

    if (result.success) return;
    expect(result.issues.map(issue => issue.path?.map(segment => segment.key).join('.'))).toContain('confirmPassword');
  });

  it('新密码短于 6 位被拦', () => {
    const result = v.safeParse(changePasswordFormSchema, { ...EMPTY_PASSWORD_FORM, newPassword: '123' });

    expect(result.success).toBe(false);
  });
});

describe('表单值 ↔ 接口载荷', () => {
  it('空串 trim 后转 null', () => {
    const payload = toUpdateProfilePayload({
      fullName: '  ',
      email: '',
      phone: '',
      homePath: '  /  ',
      description: ''
    });

    expect(payload).toEqual({ fullName: null, email: null, phone: null, homePath: '/', description: null });
  });

  it('null 用户信息回填成空串', () => {
    expect(
      toProfileFormValues({ fullName: null, email: null, phone: null, description: null, homePath: null })
    ).toEqual(EMPTY_PROFILE_FORM);
  });

  it('有值用户信息原样回填', () => {
    expect(
      toProfileFormValues({
        fullName: '张三',
        email: 'a@b.com',
        phone: '13800000000',
        description: 'hi',
        homePath: '/home'
      })
    ).toEqual({ fullName: '张三', email: 'a@b.com', phone: '13800000000', description: 'hi', homePath: '/home' });
  });
});
