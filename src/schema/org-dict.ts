import { array, description, intersect, nonEmpty, nullable, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { descriptionSchema, idSchema, orderSchema, paginationQuerySchema, yesOrNoSchema } from './shared';

/**
 * 组织 / 字典 / 字典项 DTO（v3 §6.3，unify org / dict / dict-item 三套范式）。
 *
 * 三域同文件承载（对外导出名与 v2 一致），内部按域分段；`update` 一律由
 * `create` + `partial` 推导，值域只声明一份。
 */

/* -------------------------------------------------------------------------- */
/*                                    组织                                     */
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

export type OrgCreateDTO = InferOutput<typeof orgCreateSchema>;
export type OrgUpdateDTO = InferOutput<typeof orgUpdateSchema>;
export type OrgQuery = InferOutput<typeof orgQuerySchema>;

/* -------------------------------------------------------------------------- */
/*                                    字典                                     */
/* -------------------------------------------------------------------------- */

/** 新增字典 */
export const dictCreateSchema = object({
  name: pipe(string(), nonEmpty('字典名称不能为空'), description('字典名称')),
  code: pipe(string(), nonEmpty('字典编码不能为空'), description('字典编码，全局唯一')),
  description: descriptionSchema,
  isSystem: optional(yesOrNoSchema, 'N')
});

/** 更新字典（字段同新增，全部可选） */
export const dictUpdateSchema = partial(dictCreateSchema);

/** 字典分页查询 */
export const dictQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('字典名称，模糊匹配'))),
    code: optional(pipe(string(), description('字典编码，模糊匹配'))),
    isSystem: optional(yesOrNoSchema)
  })
]);

export type DictCreateDTO = InferOutput<typeof dictCreateSchema>;
export type DictUpdateDTO = InferOutput<typeof dictUpdateSchema>;
export type DictQuery = InferOutput<typeof dictQuerySchema>;

/* -------------------------------------------------------------------------- */
/*                                   字典项                                    */
/* -------------------------------------------------------------------------- */

/** 新增字典项 */
export const dictItemCreateSchema = object({
  dictId: pipe(idSchema, description('所属字典 ID')),
  parentId: optional(nullable(pipe(idSchema, description('父字典项 ID，顶层为 null'))), null),
  label: pipe(string(), nonEmpty('字典项名称不能为空'), description('字典项名称')),
  value: pipe(string(), nonEmpty('字典项值不能为空'), description('字典项值')),
  order: orderSchema
});

/** 更新字典项（字段同新增，全部可选） */
export const dictItemUpdateSchema = partial(dictItemCreateSchema);

/** 字典项分页查询 */
export const dictItemQuerySchema = intersect([
  paginationQuerySchema,
  object({
    dictId: optional(pipe(idSchema, description('所属字典 ID'))),
    label: optional(pipe(string(), description('字典项名称，模糊匹配'))),
    value: optional(pipe(string(), description('字典项值，模糊匹配')))
  })
]);

/** 字典树查询（`GET /api/dict-item/tree/:id`） */
export const dictItemTreeParamSchema = object({ id: pipe(idSchema, description('字典 ID')) });

export type DictItemCreateDTO = InferOutput<typeof dictItemCreateSchema>;
export type DictItemUpdateDTO = InferOutput<typeof dictItemUpdateSchema>;
export type DictItemQuery = InferOutput<typeof dictItemQuerySchema>;
export type DictItemTreeParam = InferOutput<typeof dictItemTreeParamSchema>;

export { batchDeleteSchema, idParamSchema } from './shared';
