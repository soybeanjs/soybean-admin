import { array, description, intersect, nonEmpty, nullable, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { requiredText, text } from './_form';
import { enabledSearchSchema, searchText } from './_search';
import {
  auditFields,
  descriptionSchema,
  enabledSchema,
  idSchema,
  pagedSchema,
  paginationQuerySchema,
  rowText
} from './_shared';

/** 用户契约（v3 §6.3，unify user.service 范式；`password` 只进不出）。 */

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
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 用户行公共字段（`stripPassword(row)`；password 只在详情里单独补） */
const userRowFields = {
  id: idSchema,
  enabled: enabledSchema,
  username: pipe(string(), description('用户名，全局唯一')),
  phone: rowText('手机号'),
  email: rowText('邮箱'),
  fullName: rowText('姓名'),
  avatar: rowText('头像地址'),
  homePath: rowText('登录后跳转的首页路径'),
  description: rowText('备注说明'),
  ...auditFields
};

/** 用户资源（新增 / 更新响应，无 password） */
export const userResourceSchema = object(userRowFields);

/** 用户列表行（`userService.getUserList` 输出：用户资源 + 已绑角色 ID） */
export const userRowSchema = object({
  ...userRowFields,
  roles: pipe(array(object({ id: idSchema })), description('已绑定的角色 ID 列表'))
});

/** `GET /api/user/list` 响应 data */
export const userPageSchema = pagedSchema(userRowSchema);

/** 用户列表（无分页的列表端点响应 data） */
export const userListSchema = pipe(array(userResourceSchema), description('用户列表'));

/** 用户详情（`GET /api/user/:id` 刻意返回整行，**含 password**，仅管理端可见） */
export const userDetailSchema = object({
  ...userRowFields,
  password: pipe(string(), description('登录密码（仅管理端详情返回）'))
});

/** 当前用户资料（`PUT /api/auth/profile` 响应 = 用户资源 + 角色码 + 按钮权限码） */
export const userProfileSchema = object({
  ...userRowFields,
  roles: pipe(array(string()), description('角色码列表')),
  buttons: pipe(array(string()), description('按钮级权限码列表'))
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

/** 用户新增 / 编辑表单 详见 docs/v3-notes.md N-224。 */
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
export function toUserForm(row: UserDetail & { roles?: { id: string }[] }): UserFormDTO {
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

export type UserResource = InferOutput<typeof userResourceSchema>;
export type UserList = InferOutput<typeof userListSchema>;
export type UserRowOutput = InferOutput<typeof userRowSchema>;
export type UserDetail = InferOutput<typeof userDetailSchema>;
export type UserProfile = InferOutput<typeof userProfileSchema>;
export type UserCreateDTO = InferOutput<typeof userCreateSchema>;
export type UserUpdateDTO = InferOutput<typeof userUpdateSchema>;
export type UserQuery = InferOutput<typeof userQuerySchema>;
export type ModifyPasswordDTO = InferOutput<typeof modifyPasswordSchema>;
export type UserRoleAssignDTO = InferOutput<typeof userRoleAssignSchema>;
export type UserSearchFormDTO = InferOutput<typeof userSearchFormSchema>;
export type UserFormDTO = InferOutput<typeof userFormSchema>;
