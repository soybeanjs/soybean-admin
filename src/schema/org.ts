import { array, description, intersect, nonEmpty, nullable, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { nullableText, requiredText } from './_form';
import { searchText } from './_search';
import {
  auditFields,
  descriptionSchema,
  enabledSchema,
  idSchema,
  pagedSchema,
  paginationQuerySchema,
  rowText
} from './_shared';

/** 组织契约（v3 §6.3，unify org.service 范式）。`update` 一律由 `create` + `partial` 推导，值域只声明一份。 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增组织 */
export const orgCreateSchema = object({
  parentId: optional(nullable(pipe(idSchema, description('父组织 ID，顶层为 null'))), null),
  name: pipe(string(), nonEmpty('组织名称不能为空'), description('组织名称')),
  code: pipe(string(), nonEmpty('组织编码不能为空'), description('组织编码，全局唯一')),
  description: descriptionSchema
});

/** 更新组织（字段同新增，全部可选） */
export const orgUpdateSchema = partial(orgCreateSchema);

/** 组织分页查询 */
export const orgQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('组织名称，模糊匹配'))),
    code: optional(pipe(string(), description('组织编码，模糊匹配')))
  })
]);

/** 组织绑定角色 */
export const orgRoleAssignSchema = object({
  roleIds: pipe(array(idSchema), description('角色 ID 列表，全量替换'))
});

/** 组织绑定用户 */
export const orgUserAssignSchema = object({
  userIds: pipe(array(idSchema), description('用户 ID 列表，全量替换'))
});

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 组织资源（新增 / 更新 / 详情响应） */
export const orgResourceSchema = object({
  id: idSchema,
  enabled: enabledSchema,
  parentId: rowText('父组织 ID，顶层为 null'),
  name: pipe(string(), description('组织名称')),
  code: pipe(string(), description('组织编码，全局唯一')),
  description: rowText('备注说明'),
  ...auditFields
});

/** `GET /api/org/list` 响应 data */
export const orgPageSchema = pagedSchema(orgResourceSchema);

/** `GET /api/org/all` 响应 data（全量组织，无分页） */
export const orgListSchema = pipe(array(orgResourceSchema), description('组织全量列表'));

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 组织列表搜索表单 */
export const orgSearchFormSchema = object({
  name: searchText('组织名称'),
  code: searchText('组织编码')
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/** 组织新增 / 编辑表单 */
export const orgFormSchema = object({
  parentId: nullable(idSchema),
  name: requiredText('组织名称'),
  code: requiredText('组织编码'),
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增组织的空表默认值 */
export const emptyOrgForm: OrgFormDTO = {
  parentId: null,
  name: '',
  code: '',
  description: null
};

/** 组织行 → 编辑表单值 */
export function toOrgForm(row: OrgResource): OrgFormDTO {
  return {
    parentId: row.parentId,
    name: row.name,
    code: row.code,
    description: row.description
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type OrgResource = InferOutput<typeof orgResourceSchema>;
export type OrgList = InferOutput<typeof orgListSchema>;
export type OrgCreateDTO = InferOutput<typeof orgCreateSchema>;
export type OrgUpdateDTO = InferOutput<typeof orgUpdateSchema>;
export type OrgQuery = InferOutput<typeof orgQuerySchema>;
export type OrgSearchFormDTO = InferOutput<typeof orgSearchFormSchema>;
export type OrgFormDTO = InferOutput<typeof orgFormSchema>;
