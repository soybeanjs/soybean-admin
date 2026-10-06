import * as v from 'valibot';
import {
  batchDeleteSchema,
  descriptionSchema,
  enabledSchema,
  idParamSchema,
  idSchema,
  paginationQuerySchema
} from './shared';

/** permission DTO（unify permission.service 范式） */

export const permissionCreateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  resourceType: v.optional(v.picklist(['menu', 'api', 'button', 'other']), 'other'),
  resourceId: v.optional(v.nullable(idSchema), null),
  description: descriptionSchema
});
export type PermissionCreateDTO = v.InferOutput<typeof permissionCreateSchema>;

export const permissionUpdateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  resourceType: v.optional(v.picklist(['menu', 'api', 'button', 'other'])),
  resourceId: v.optional(v.nullable(idSchema)),
  description: v.optional(v.nullable(v.string()))
});
export type PermissionUpdateDTO = v.InferOutput<typeof permissionUpdateSchema>;

export const permissionQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    resourceType: v.optional(v.picklist(['menu', 'api', 'button', 'other'])),
    enabled: v.optional(enabledSchema)
  })
]);
export type PermissionQuery = v.InferOutput<typeof permissionQuerySchema>;

export const permissionBatchDeleteSchema = batchDeleteSchema;
export const permissionIdParamSchema = idParamSchema;

/** 角色-权限分配 */
export const rolePermissionAssignSchema = v.object({ permissionIds: v.array(idSchema) });
