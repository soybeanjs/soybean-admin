import {
  array,
  description,
  integer,
  intersect,
  nonEmpty,
  number,
  object,
  optional,
  partial,
  pipe,
  string
} from 'valibot';
import type { InferOutput } from 'valibot';
import type { RoleDetail } from '@/service/api/role';
import { nullableText, requiredText } from './_form';
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

/** 角色契约（v3 §6.3，unify role.service 范式）。 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增角色 */
export const roleCreateSchema = object({
  name: pipe(string(), nonEmpty('角色名称不能为空'), description('角色名称')),
  code: pipe(string(), nonEmpty('角色编码不能为空'), description('角色编码，全局唯一')),
  description: descriptionSchema,
  permissionIds: optional(pipe(array(idSchema), description('绑定的权限 ID 列表')), [])
});

/** 更新角色（字段同新增，全部可选；额外允许改启用状态） */
export const roleUpdateSchema = partial(
  object({
    ...roleCreateSchema.entries,
    enabled: optional(enabledSchema)
  })
);

/** 角色分页查询 */
export const roleQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('角色名称，模糊匹配'))),
    code: optional(pipe(string(), description('角色编码，模糊匹配'))),
    enabled: optional(enabledSchema)
  })
]);

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 角色资源（新增 / 更新响应） */
export const roleResourceSchema = object({
  id: idSchema,
  enabled: enabledSchema,
  name: pipe(string(), description('角色名称')),
  code: pipe(string(), description('角色编码，全局唯一')),
  description: rowText('备注说明'),
  ...auditFields
});

/** 角色列表行（角色资源 + 已分配用户数） */
export const roleRowSchema = object({
  ...roleResourceSchema.entries,
  userCount: pipe(number(), integer(), description('已分配该角色的用户数'))
});

/** `GET /api/role/list` 响应 data */
export const rolePageSchema = pagedSchema(roleRowSchema);

/** `GET /api/role/all` 响应 data（全量角色，无分页） */
export const roleListSchema = pipe(array(roleResourceSchema), description('角色全量列表'));

/** 角色详情（`GET /api/role/:id` = 角色资源 + 已绑权限点摘要） */
export const roleDetailSchema = object({
  ...roleResourceSchema.entries,
  permissions: pipe(
    array(
      object({
        id: idSchema,
        name: pipe(string(), description('权限名称')),
        code: pipe(string(), description('权限编码'))
      })
    ),
    description('已绑定的权限点')
  )
});

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 角色列表搜索表单 */
export const roleSearchFormSchema = object({
  name: searchText('角色名称'),
  code: searchText('角色编码'),
  enabled: enabledSearchSchema
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/** 角色新增 / 编辑表单 */
export const roleFormSchema = object({
  name: requiredText('角色名称'),
  code: requiredText('角色编码'),
  description: nullableText('备注说明'),
  enabled: enabledSchema,
  permissionIds: pipe(array(idSchema), description('绑定的权限 ID 列表'))
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增角色的空表默认值 */
export const emptyRoleForm: RoleFormDTO = {
  name: '',
  code: '',
  description: null,
  enabled: 'Y',
  permissionIds: []
};

/** 角色详情 → 编辑表单值 */
export function toRoleForm(row: RoleDetail): RoleFormDTO {
  return {
    name: row.name,
    code: row.code,
    description: row.description,
    enabled: row.enabled,
    permissionIds: row.permissions.map(permission => permission.id)
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type RoleResource = InferOutput<typeof roleResourceSchema>;
export type RoleList = InferOutput<typeof roleListSchema>;
export type RoleRowOutput = InferOutput<typeof roleRowSchema>;
export type RoleDetailOutput = InferOutput<typeof roleDetailSchema>;
export type RoleCreateDTO = InferOutput<typeof roleCreateSchema>;
export type RoleUpdateDTO = InferOutput<typeof roleUpdateSchema>;
export type RoleQuery = InferOutput<typeof roleQuerySchema>;
export type RoleSearchFormDTO = InferOutput<typeof roleSearchFormSchema>;
export type RoleFormDTO = InferOutput<typeof roleFormSchema>;
