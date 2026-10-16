import { array, description, intersect, nonEmpty, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { nullableText, requiredText, text } from './_form';
import { apiMethodSearchSchema, searchText } from './_search';
import {
  apiMethodSchema,
  auditFields,
  descriptionSchema,
  enabledSchema,
  idSchema,
  pagedSchema,
  paginationQuerySchema,
  rowText
} from './_shared';

/** 接口（API）资源契约（v3 §6.3，unify api.service 范式） 详见 docs/v3-notes.md N-202。 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增接口 */
export const apiCreateSchema = object({
  name: pipe(string(), nonEmpty('接口名称不能为空'), description('接口名称')),
  path: pipe(string(), nonEmpty('接口路径不能为空'), description('接口路径，如 /api/user/list')),
  method: apiMethodSchema,
  description: descriptionSchema
});

/** 更新接口（字段同新增，全部可选） */
export const apiUpdateSchema = partial(apiCreateSchema);

/** 接口分页查询 */
export const apiQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('接口名称，模糊匹配'))),
    path: optional(pipe(string(), description('接口路径，模糊匹配'))),
    method: optional(apiMethodSchema)
  })
]);

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 接口资源（新增 / 更新 / 详情响应） */
export const apiResourceSchema = object({
  id: idSchema,
  enabled: enabledSchema,
  name: pipe(string(), description('接口名称')),
  path: pipe(string(), description('接口路径，如 /api/user/list')),
  method: apiMethodSchema,
  description: rowText('备注说明'),
  ...auditFields
});

/** `GET /api/api/list` 响应 data */
export const apiPageSchema = pagedSchema(apiResourceSchema);

/** `GET /api/api/all` 响应 data（全量接口，无分页） */
export const apiListSchema = pipe(array(apiResourceSchema), description('接口全量列表'));

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 接口列表搜索表单 */
export const apiSearchFormSchema = object({
  name: searchText('接口名称'),
  path: searchText('接口路径'),
  method: apiMethodSearchSchema
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/** 接口新增 / 编辑表单 */
export const apiFormSchema = object({
  name: requiredText('接口名称'),
  path: requiredText('接口路径'),
  method: apiMethodSchema,
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增接口的空表默认值 */
export const emptyApiForm: ApiFormDTO = {
  name: '',
  path: '',
  method: 'get',
  description: null
};

/** 接口行 → 编辑表单值 */
export function toApiForm(row: ApiResource): ApiFormDTO {
  return {
    name: row.name,
    path: row.path,
    method: row.method,
    description: text(row.description)
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type ApiResource = InferOutput<typeof apiResourceSchema>;
export type ApiList = InferOutput<typeof apiListSchema>;
export type ApiCreateDTO = InferOutput<typeof apiCreateSchema>;
export type ApiUpdateDTO = InferOutput<typeof apiUpdateSchema>;
export type ApiQuery = InferOutput<typeof apiQuerySchema>;
export type ApiSearchFormDTO = InferOutput<typeof apiSearchFormSchema>;
export type ApiFormDTO = InferOutput<typeof apiFormSchema>;
