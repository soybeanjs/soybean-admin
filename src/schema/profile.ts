import * as v from 'valibot';

/**
 * user-center（个人中心）表单契约（P3-09）。
 *
 * 与 `src/schema/auth.ts` 的分工：认证域 schema 管「登录 / 注册 / 重置密码」
 * （服务端对应 `src/routes/api/auth/**`）；这里是**登录后**的个人资料与修改
 * 密码，两者共用同一套 valibot 约定（P3-05 的 StandardSchema 复用方式）。
 *
 * 服务端 `PUT /api/auth/profile` 的 DTO 是 `userUpdateSchema` 的子集
 * （`fullName` / `email` / `phone` / `description` / `homePath`，都可空），
 * 所以这里**不新造服务端规则**，只补两件服务端没有的事：
 * 1. 空串与「有值」的形状校验（邮箱 / 手机号格式）—— 服务端只校验类型；
 * 2. 密码一致的跨字段校验（`confirmPassword`，同 `registerFormSchema` 的写法）。
 */

/** 邮箱：允许空串（用户没填），非空时必须是合法邮箱 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** 手机号：允许空串，非空时允许数字 / 空格 / `+` / `-`，6~20 位 */
export const PHONE_PATTERN = /^[\d\s+-]{6,20}$/;

/**
 * 服务端可空文本字段：`null` 或空串都视为「清空」，非空时跑格式校验。
 *
 * 服务端收到的是 `null`（`toUpdateProfilePayload` 已把空串转成 `null`），
 * 但表单回填/手写请求可能给空串，所以两种都接受 —— 校验规则与表单侧共用一个正则。
 */
function optionalText(pattern: RegExp, message: string) {
  return v.optional(
    v.nullable(
      v.pipe(
        v.string(),
        v.check(value => value === '' || pattern.test(value), message)
      )
    )
  );
}

/**
 * `PUT /api/auth/profile` 的请求体 schema（前后端共用）。
 *
 * 比 `userUpdateSchema` 窄：不含 `password` / `enabled` / `roleIds` —— 个人中心
 * 不允许改自己的状态与角色（那是 manage 页的职责）。
 */
export const profileUpdateSchema = v.object({
  fullName: v.optional(v.nullable(v.string())),
  email: optionalText(EMAIL_PATTERN, '邮箱格式不正确'),
  phone: optionalText(PHONE_PATTERN, '手机号格式不正确'),
  homePath: v.optional(v.nullable(v.string())),
  description: v.optional(v.nullable(v.string()))
});

export type UpdateProfilePayload = v.InferOutput<typeof profileUpdateSchema>;

/** 个人资料表单（空串 = 清空该字段，提交前统一转 `null`） */
export const profileFormSchema = v.object({
  fullName: v.string(),
  email: v.pipe(
    v.string(),
    v.check(value => value === '' || EMAIL_PATTERN.test(value), '邮箱格式不正确')
  ),
  phone: v.pipe(
    v.string(),
    v.check(value => value === '' || PHONE_PATTERN.test(value), '手机号格式不正确')
  ),
  homePath: v.string(),
  description: v.string()
});

export type ProfileFormValues = v.InferOutput<typeof profileFormSchema>;

/** 修改密码表单（新密码 + 确认密码一致，同 `registerFormSchema` 的 `v.forward` 写法） */
export const changePasswordFormSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(v.string(), v.nonEmpty('当前密码不能为空')),
    newPassword: v.pipe(v.string(), v.minLength(6, '新密码至少 6 个字符')),
    confirmPassword: v.string()
  }),
  v.forward(
    v.partialCheck(
      [['newPassword'], ['confirmPassword']],
      values => values.newPassword === values.confirmPassword,
      '两次输入的密码不一致'
    ),
    ['confirmPassword']
  )
);

export type ChangePasswordFormValues = v.InferOutput<typeof changePasswordFormSchema>;

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

/** 空串 → `null`（表单语义：留空即清空该字段） */
function toNullable(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === '' ? null : trimmed;
}

/**
 * 表单值 → 接口载荷。
 *
 * 一律 `trim()` 后转 `null`：表单里「删掉内容」应当清空字段，而不是写入空串
 * —— 空串会污染列表的 `'-'` 占位判断（见 manage 页的字段渲染）。
 */
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
