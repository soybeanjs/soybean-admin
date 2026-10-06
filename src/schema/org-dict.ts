import * as v from 'valibot';
import {
  batchDeleteSchema,
  descriptionSchema,
  idParamSchema,
  idSchema,
  orderSchema,
  paginationQuerySchema
} from './shared';

/** org DTO（unify org.service 范式） */

export const orgCreateSchema = v.object({
  parentId: v.optional(v.nullable(idSchema), null),
  name: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.nonEmpty()),
  description: descriptionSchema
});
export type OrgCreateDTO = v.InferOutput<typeof orgCreateSchema>;

export const orgUpdateSchema = v.object({
  parentId: v.optional(v.nullable(idSchema)),
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  description: v.optional(v.nullable(v.string()))
});
export type OrgUpdateDTO = v.InferOutput<typeof orgUpdateSchema>;

export const orgQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    name: v.optional(v.string()),
    code: v.optional(v.string())
  })
]);
export type OrgQuery = v.InferOutput<typeof orgQuerySchema>;

export const orgBatchDeleteSchema = batchDeleteSchema;
export const orgIdParamSchema = idParamSchema;

/** org 绑定角色 */
export const orgRoleAssignSchema = v.object({ roleIds: v.array(idSchema) });

/** user 归属 org */
export const orgUserAssignSchema = v.object({ userIds: v.array(idSchema) });

/** dict / dict-item DTO（unify dict.service 范式） */

export const dictCreateSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.nonEmpty()),
  description: descriptionSchema,
  isSystem: v.optional(v.picklist(['Y', 'N']), 'N')
});
export type DictCreateDTO = v.InferOutput<typeof dictCreateSchema>;

export const dictUpdateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  description: v.optional(v.nullable(v.string())),
  isSystem: v.optional(v.picklist(['Y', 'N']))
});
export type DictUpdateDTO = v.InferOutput<typeof dictUpdateSchema>;

export const dictQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    isSystem: v.optional(v.picklist(['Y', 'N']))
  })
]);
export type DictQuery = v.InferOutput<typeof dictQuerySchema>;

export const dictBatchDeleteSchema = batchDeleteSchema;
export const dictIdParamSchema = idParamSchema;

export const dictItemCreateSchema = v.object({
  dictId: idSchema,
  parentId: v.optional(v.nullable(idSchema), null),
  label: v.pipe(v.string(), v.nonEmpty()),
  value: v.pipe(v.string(), v.nonEmpty()),
  order: orderSchema
});
export type DictItemCreateDTO = v.InferOutput<typeof dictItemCreateSchema>;

export const dictItemUpdateSchema = v.object({
  dictId: v.optional(idSchema),
  parentId: v.optional(v.nullable(idSchema)),
  label: v.optional(v.pipe(v.string(), v.nonEmpty())),
  value: v.optional(v.pipe(v.string(), v.nonEmpty())),
  order: v.optional(v.nullable(v.number()))
});
export type DictItemUpdateDTO = v.InferOutput<typeof dictItemUpdateSchema>;

export const dictItemQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    dictId: v.optional(idSchema),
    label: v.optional(v.string()),
    value: v.optional(v.string())
  })
]);
export type DictItemQuery = v.InferOutput<typeof dictItemQuerySchema>;

export const dictItemBatchDeleteSchema = batchDeleteSchema;
export const dictItemIdParamSchema = idParamSchema;

/** 字典树（按 dictId 查全量并建树） */
export const dictItemTreeParamSchema = v.object({ id: idSchema });
