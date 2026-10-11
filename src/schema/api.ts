import { description, intersect, nonEmpty, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { apiMethodSchema, descriptionSchema, paginationQuerySchema } from './shared';

/**
 * 接口（API）资源 DTO（v3 §6.3，unify api.service 范式）。
 *
 * `update` 由 `create` 推导（`partial`）：新增与更新的值域只声明一份，不会
 * 两份漂移。`partial` 会去掉默认值，未传字段交由服务层 `dto.x ?? current.x`
 * 保留原值。
 */

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

export type ApiCreateDTO = InferOutput<typeof apiCreateSchema>;
export type ApiUpdateDTO = InferOutput<typeof apiUpdateSchema>;
export type ApiQuery = InferOutput<typeof apiQuerySchema>;

export { batchDeleteSchema, idParamSchema } from './shared';
