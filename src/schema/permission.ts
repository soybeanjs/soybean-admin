import { array, description, intersect, nonEmpty, nullable, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import type { PermissionRow } from '@/service/api/permission';
import { nullableText, text } from './_form';
import { enabledSearchSchema, resourceTypeSearchSchema, searchText } from './_search';
import {
  auditFields,
  descriptionSchema,
  enabledSchema,
  idSchema,
  pagedSchema,
  paginationQuerySchema,
  resourceTypeSchema,
  rowText
} from './_shared';

/**
 * 权限点契约（v3 §6.3，unify permission.service 范式）。
 *
 * `name` / `code` 只有 `resourceType === 'other'` 时才是权威值；绑定
 * `menu` / `api` / `button` 资源时由服务端 `resolveResourceBinding` 推导，
 * 故两者在新增里也是可选。
 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增权限点 */
export const permissionCreateSchema = object({
  name: optional(pipe(string(), nonEmpty('权限名称不能为空'), description('权限名称，绑定资源时由服务端推导'))),
  code: optional(pipe(string(), nonEmpty('权限编码不能为空'), description('权限编码，绑定资源时由服务端推导'))),
  resourceType: optional(resourceTypeSchema, 'other'),
  resourceId: optional(nullable(pipe(idSchema, description('绑定的资源 ID'))), null),
  description: descriptionSchema
});

/** 更新权限点（字段同新增，全部可选） */
export const permissionUpdateSchema = partial(permissionCreateSchema);

/** 权限点分页查询 */
export const permissionQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('权限名称，模糊匹配'))),
    code: optional(pipe(string(), description('权限编码，模糊匹配'))),
    resourceType: optional(resourceTypeSchema),
    enabled: optional(enabledSchema)
  })
]);

/** 角色绑定权限 */
export const rolePermissionAssignSchema = object({
  permissionIds: pipe(array(idSchema), description('权限 ID 列表，全量替换'))
});

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 权限点资源（新增 / 更新 / 详情 / 按角色查询响应） */
export const permissionResourceSchema = object({
  id: idSchema,
  enabled: enabledSchema,
  name: pipe(string(), description('权限名称')),
  code: pipe(string(), description('权限编码')),
  resourceType: resourceTypeSchema,
  resourceId: rowText('绑定的资源 ID'),
  description: rowText('备注说明'),
  ...auditFields
});

/** `GET /api/permission/list` 响应 data */
export const permissionPageSchema = pagedSchema(permissionResourceSchema);

/** `GET /api/permission/all` 响应 data（全量权限点，无分页） */
export const permissionListSchema = pipe(array(permissionResourceSchema), description('权限点全量列表'));

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 权限点列表搜索表单 */
export const permissionSearchFormSchema = object({
  name: searchText('权限名称'),
  code: searchText('权限编码'),
  resourceType: resourceTypeSearchSchema,
  enabled: enabledSearchSchema
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/**
 * 权限点新增 / 编辑表单。
 *
 * `name` / `code` 只有 `resourceType === 'other'` 时才是权威值；绑定
 * `menu` / `api` / `button` 资源时由服务端（`resolveResourceBinding`）推导，
 * 客户端传空串即可（服务端 create schema 里两者也是 optional）。
 */
export const permissionFormSchema = object({
  name: pipe(string(), description('权限名称，绑定资源时留空')),
  code: pipe(string(), description('权限编码，绑定资源时留空')),
  resourceType: resourceTypeSchema,
  resourceId: nullable(idSchema),
  enabled: enabledSchema,
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增权限点的空表默认值 */
export const emptyPermissionForm: PermissionFormDTO = {
  name: '',
  code: '',
  resourceType: 'other',
  resourceId: null,
  enabled: 'Y',
  description: null
};

/** 权限点行 → 编辑表单值 */
export function toPermissionForm(row: PermissionRow): PermissionFormDTO {
  return {
    name: text(row.name),
    code: text(row.code),
    resourceType: row.resourceType,
    resourceId: row.resourceId,
    enabled: row.enabled,
    description: row.description
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type PermissionResource = InferOutput<typeof permissionResourceSchema>;
export type PermissionList = InferOutput<typeof permissionListSchema>;
export type PermissionCreateDTO = InferOutput<typeof permissionCreateSchema>;
export type PermissionUpdateDTO = InferOutput<typeof permissionUpdateSchema>;
export type PermissionQuery = InferOutput<typeof permissionQuerySchema>;
export type PermissionSearchFormDTO = InferOutput<typeof permissionSearchFormSchema>;
export type PermissionFormDTO = InferOutput<typeof permissionFormSchema>;
