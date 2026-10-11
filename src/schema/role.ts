import { array, description, intersect, nonEmpty, object, optional, partial, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { descriptionSchema, enabledSchema, idSchema, paginationQuerySchema } from './shared';

/** 角色 DTO（v3 §6.3，unify role.service 范式）。 */

/** 新增角色 */
export const roleCreateSchema = object({
  name: pipe(string(), nonEmpty('角色名称不能为空'), description('角色名称')),
  code: pipe(string(), nonEmpty('角色编码不能为空'), description('角色编码，全局唯一')),
  description: descriptionSchema,
  permissionIds: optional(pipe(array(idSchema), description('绑定的权限 ID 列表')), [])
});

/** 更新角色（字段同新增，全部可选；额外允许改启用状态） */
export const roleUpdateSchema = partial(
  object({
    ...roleCreateSchema.entries,
    enabled: optional(enabledSchema)
  })
);

/** 角色分页查询 */
export const roleQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('角色名称，模糊匹配'))),
    code: optional(pipe(string(), description('角色编码，模糊匹配'))),
    enabled: optional(enabledSchema)
  })
]);

export type RoleCreateDTO = InferOutput<typeof roleCreateSchema>;
export type RoleUpdateDTO = InferOutput<typeof roleUpdateSchema>;
export type RoleQuery = InferOutput<typeof roleQuerySchema>;

export { batchDeleteSchema, idParamSchema } from './shared';
