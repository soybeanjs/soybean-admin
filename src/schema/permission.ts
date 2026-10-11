import { array, description, intersect, nonEmpty, nullable, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { descriptionSchema, enabledSchema, idSchema, paginationQuerySchema, resourceTypeSchema } from './shared';

/**
 * 权限点 DTO（v3 §6.3，unify permission.service 范式）。
 *
 * `name` / `code` 只有 `resourceType === 'other'` 时才是权威值；绑定
 * `menu` / `api` / `button` 资源时由服务端 `resolveResourceBinding` 推导，
 * 故两者在新增里也是可选。
 */

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

export type PermissionCreateDTO = InferOutput<typeof permissionCreateSchema>;
export type PermissionUpdateDTO = InferOutput<typeof permissionUpdateSchema>;
export type PermissionQuery = InferOutput<typeof permissionQuerySchema>;

export { batchDeleteSchema, idParamSchema } from './shared';
