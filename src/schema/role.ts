import * as v from 'valibot';
import {
  batchDeleteSchema,
  descriptionSchema,
  enabledSchema,
  idParamSchema,
  idSchema,
  paginationQuerySchema
} from './shared';

/** role DTO（unify role.service 范式） */

export const roleCreateSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.nonEmpty()),
  description: descriptionSchema,
  permissionIds: v.optional(v.array(idSchema), [])
});
export type RoleCreateDTO = v.InferOutput<typeof roleCreateSchema>;

export const roleUpdateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  description: v.optional(v.nullable(v.string())),
  enabled: v.optional(enabledSchema),
  permissionIds: v.optional(v.array(idSchema))
});
export type RoleUpdateDTO = v.InferOutput<typeof roleUpdateSchema>;

export const roleQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    enabled: v.optional(enabledSchema)
  })
]);
export type RoleQuery = v.InferOutput<typeof roleQuerySchema>;

export const roleBatchDeleteSchema = batchDeleteSchema;
export const roleIdParamSchema = idParamSchema;

/** 角色菜单/按钮权限分配（v3 §6.3 role 分配能力） */
export const roleMenuAssignSchema = v.object({ menuIds: v.array(idSchema) });
export const roleButtonAssignSchema = v.object({ buttonIds: v.array(idSchema) });
