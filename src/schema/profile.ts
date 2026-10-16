import {
  check,
  description,
  forward,
  minLength,
  nonEmpty,
  nullable,
  object,
  optional,
  partialCheck,
  pipe,
  string
} from 'valibot';
import type { InferOutput } from 'valibot';

/** 所以这里**不新造服务端规则**，只补两件服务端没有的事： 详见 docs/v3-notes.md N-218。 */

/** 邮箱：允许空串（用户没填），非空时必须是合法邮箱 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** 手机号：允许空串，非空时允许数字 / 空格 / `+` / `-`，6~20 位 */
export const PHONE_PATTERN = /^[\d\s+-]{6,20}$/;

/** 服务端可空文本字段：`null` 或空串都视为「清空」，非空时跑格式校验 详见 docs/v3-notes.md N-219。 */
const optionalText = (pattern: RegExp, message: string, label: string) =>
  optional(
    nullable(
      pipe(
        string(),
        check(value => value === '' || pattern.test(value), message),
        description(label)
      )
    )
  );

/** 表单侧文本字段：空串 = 清空，非空时跑格式校验 */
const textWithPattern = (pattern: RegExp, message: string, label: string) =>
  pipe(
    string(),
    check(value => value === '' || pattern.test(value), message),
    description(label)
  );

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** `PUT /api/auth/profile` 的请求体 schema（前后端共用） 详见 docs/v3-notes.md N-220。 */
export const profileUpdateSchema = object({
  fullName: optional(nullable(pipe(string(), description('姓名')))),
  email: optionalText(EMAIL_PATTERN, '邮箱格式不正确', '邮箱'),
  phone: optionalText(PHONE_PATTERN, '手机号格式不正确', '手机号'),
  homePath: optional(nullable(pipe(string(), description('登录后跳转的首页路径')))),
  description: optional(nullable(pipe(string(), description('备注说明'))))
});

/* -------------------------------------------------------------------------- */
/*                              个人中心表单 schema                            */
/* -------------------------------------------------------------------------- */

/** 个人资料表单（空串 = 清空该字段，提交前统一转 `null`） */
export const profileFormSchema = object({
  fullName: pipe(string(), description('姓名')),
  email: textWithPattern(EMAIL_PATTERN, '邮箱格式不正确', '邮箱'),
  phone: textWithPattern(PHONE_PATTERN, '手机号格式不正确', '手机号'),
  homePath: pipe(string(), description('登录后跳转的首页路径')),
  description: pipe(string(), description('备注说明'))
});

/** 修改密码表单（新密码 + 确认密码一致，同 `registerFormSchema` 的 `forward` 写法） */
export const changePasswordFormSchema = pipe(
  object({
    currentPassword: pipe(string(), nonEmpty('当前密码不能为空'), description('当前密码')),
    newPassword: pipe(string(), minLength(6, '新密码至少 6 个字符'), description('新密码')),
    confirmPassword: pipe(string(), description('确认密码，需与新密码一致'))
  }),
  forward(
    partialCheck(
      [['newPassword'], ['confirmPassword']],
      values => values.newPassword === values.confirmPassword,
      '两次输入的密码不一致'
    ),
    ['confirmPassword']
  )
);

/* -------------------------------------------------------------------------- */
/*                                  表单默认值                                 */
/* -------------------------------------------------------------------------- */

/** 空表单默认值（`useForm` 的 `defaultValues`） */
export const EMPTY_PROFILE_FORM: ProfileFormValues = {
  fullName: '',
  email: '',
  phone: '',
  homePath: '',
  description: ''
};

export const EMPTY_PASSWORD_FORM: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

/* -------------------------------------------------------------------------- */
/*                                  表单换算                                   */
/* -------------------------------------------------------------------------- */

/** 空串 → `null`（表单语义：留空即清空该字段） */
function toNullable(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === '' ? null : trimmed;
}

/** 表单值 → 接口载荷。一律 `trim()` 后转 `null`：表单里「删掉内容」应当清空字段，而不是写入空串—— 空串会污染列表的 `'-'` 占位判断（见 manage 页的字段渲染）。 */
export function toUpdateProfilePayload(values: ProfileFormValues): UpdateProfilePayload {
  return {
    fullName: toNullable(values.fullName),
    email: toNullable(values.email),
    phone: toNullable(values.phone),
    description: toNullable(values.description),
    homePath: toNullable(values.homePath)
  };
}

/** 当前用户信息 → 表单默认值（`null` 统一转空串） */
export function toProfileFormValues(user: {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
  homePath: string | null;
}): ProfileFormValues {
  return {
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    homePath: user.homePath ?? '',
    description: user.description ?? ''
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type UpdateProfilePayload = InferOutput<typeof profileUpdateSchema>;
export type ProfileFormValues = InferOutput<typeof profileFormSchema>;
export type ChangePasswordFormValues = InferOutput<typeof changePasswordFormSchema>;
export type ProfileUser = Parameters<typeof toProfileFormValues>[0];
