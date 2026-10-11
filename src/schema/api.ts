import { description, intersect, nonEmpty, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import type { ApiRow } from '@/service/api/api';
import { nullableText, requiredText, text } from './_form';
import { apiMethodSearchSchema, searchText } from './_search';
import { apiMethodSchema, descriptionSchema, paginationQuerySchema } from './_shared';

/**
 * 接口（API）资源契约（v3 §6.3，unify api.service 范式）。
 *
 * 一个接口域一个文件，装三件事：服务端请求 schema、搜索表单 schema、operate
 * 表单 schema 及默认值。命名约定：`apiXxxSchema` = 服务端请求，
 * `apiSearchFormSchema` = 搜索表单，`apiFormSchema` = operate 表单。
 *
 * `update` 由 `create` 推导（`partial`）：新增与更新的值域只声明一份，不会
 * 两份漂移。`partial` 会去掉默认值，未传字段交由服务层 `dto.x ?? current.x`
 * 保留原值。
 */

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
export function toApiForm(row: ApiRow): ApiFormDTO {
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

export type ApiCreateDTO = InferOutput<typeof apiCreateSchema>;
export type ApiUpdateDTO = InferOutput<typeof apiUpdateSchema>;
export type ApiQuery = InferOutput<typeof apiQuerySchema>;
export type ApiSearchFormDTO = InferOutput<typeof apiSearchFormSchema>;
export type ApiFormDTO = InferOutput<typeof apiFormSchema>;
