import { array, description, intersect, nonEmpty, nullable, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import type { UserDetailRow } from '@/service/api/user';
import { requiredText, text } from './_form';
import { enabledSearchSchema, searchText } from './_search';
import { descriptionSchema, enabledSchema, idSchema, paginationQuerySchema } from './_shared';

/**
 * 用户契约（v3 §6.3，unify user.service 范式；`password` 只进不出）。
 *
 * `update` 由 `create` + `partial` 推导；`enabled` 只在更新时可用（新增一律
 * 由服务端置 `'Y'`），故单独并入。
 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增用户 */
export const userCreateSchema = object({
  username: pipe(string(), nonEmpty('用户名不能为空'), description('用户名，全局唯一')),
  password: pipe(string(), nonEmpty('密码不能为空'), description('登录密码，仅入不出')),
  phone: optional(nullable(pipe(string(), description('手机号'))), null),
  email: optional(nullable(pipe(string(), description('邮箱'))), null),
  fullName: optional(nullable(pipe(string(), description('姓名'))), null),
  avatar: optional(nullable(pipe(string(), description('头像地址'))), null),
  homePath: optional(nullable(pipe(string(), description('登录后跳转的首页路径'))), '/home'),
  // 服务端 createUser 不读 description（固定写 null），故新增不暴露给客户端
  roleIds: optional(pipe(array(idSchema), description('绑定的角色 ID 列表')), [])
});

/** 更新用户（字段同新增，全部可选；额外允许改启用状态与备注） */
export const userUpdateSchema = partial(
  object({
    ...userCreateSchema.entries,
    description: descriptionSchema,
    enabled: optional(enabledSchema)
  })
);

/** 用户分页查询 */
export const userQuerySchema = intersect([
  paginationQuerySchema,
  object({
    username: optional(pipe(string(), description('用户名，模糊匹配'))),
    phone: optional(pipe(string(), description('手机号，模糊匹配'))),
    email: optional(pipe(string(), description('邮箱，模糊匹配'))),
    fullName: optional(pipe(string(), description('姓名，模糊匹配'))),
    enabled: optional(enabledSchema)
  })
]);

/** 修改当前登录用户的密码 */
export const modifyPasswordSchema = object({
  currentPassword: pipe(string(), nonEmpty('当前密码不能为空'), description('当前密码')),
  newPassword: pipe(string(), nonEmpty('新密码不能为空'), description('新密码'))
});

/** 用户分配角色 */
export const userRoleAssignSchema = object({
  roleIds: pipe(array(idSchema), description('角色 ID 列表，全量替换'))
});

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 用户列表搜索表单 */
export const userSearchFormSchema = object({
  username: searchText('用户名'),
  phone: searchText('手机号'),
  email: searchText('邮箱'),
  fullName: searchText('姓名'),
  enabled: enabledSearchSchema
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/**
 * 用户新增 / 编辑表单。
 *
 * `password` 用「空串 = 不改」语义：新增时必填（服务端 `userCreateSchema`
 * 强制），编辑时留空即从提交载荷里剔除。**不在 schema 层做条件必填** ——
 * 跨字段 refine 的 issue 无字段路径，会落到 `_form` 键，弹窗里没地方渲染。
 */
export const userFormSchema = object({
  username: requiredText('用户名'),
  password: pipe(string(), description('登录密码，编辑时留空表示不改')),
  fullName: pipe(string(), description('姓名')),
  phone: pipe(string(), description('手机号')),
  email: pipe(string(), description('邮箱')),
  homePath: pipe(string(), description('登录后跳转的首页路径')),
  enabled: enabledSchema,
  roleIds: pipe(array(idSchema), description('绑定的角色 ID 列表'))
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增用户的空表默认值 */
export const emptyUserForm: UserFormDTO = {
  username: '',
  password: '',
  fullName: '',
  phone: '',
  email: '',
  homePath: '/home',
  enabled: 'Y',
  roleIds: []
};

/** 用户行 → 编辑表单值 */
export function toUserForm(row: UserDetailRow & { roles?: { id: string }[] }): UserFormDTO {
  return {
    username: row.username,
    password: '',
    fullName: text(row.fullName),
    phone: text(row.phone),
    email: text(row.email),
    homePath: text(row.homePath) || '/home',
    enabled: row.enabled,
    roleIds: row.roles?.map(role => role.id) ?? []
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type UserCreateDTO = InferOutput<typeof userCreateSchema>;
export type UserUpdateDTO = InferOutput<typeof userUpdateSchema>;
export type UserQuery = InferOutput<typeof userQuerySchema>;
export type ModifyPasswordDTO = InferOutput<typeof modifyPasswordSchema>;
export type UserRoleAssignDTO = InferOutput<typeof userRoleAssignSchema>;
export type UserSearchFormDTO = InferOutput<typeof userSearchFormSchema>;
export type UserFormDTO = InferOutput<typeof userFormSchema>;
