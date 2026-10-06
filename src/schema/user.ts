import * as v from 'valibot';
import { batchDeleteSchema, enabledSchema, idParamSchema, idSchema, paginationQuerySchema } from './shared';

/** user DTO（unify user.service 范式；password 只进不出） */

export const userCreateSchema = v.object({
  username: v.pipe(v.string(), v.nonEmpty()),
  password: v.pipe(v.string(), v.nonEmpty()),
  phone: v.optional(v.nullable(v.string()), null),
  email: v.optional(v.nullable(v.string()), null),
  fullName: v.optional(v.nullable(v.string()), null),
  avatar: v.optional(v.nullable(v.string()), null),
  homePath: v.optional(v.nullable(v.string()), '/home'),
  roleIds: v.optional(v.array(idSchema), [])
});
export type UserCreateDTO = v.InferOutput<typeof userCreateSchema>;

export const userUpdateSchema = v.object({
  password: v.optional(v.pipe(v.string(), v.nonEmpty())),
  phone: v.optional(v.nullable(v.string())),
  email: v.optional(v.nullable(v.string())),
  fullName: v.optional(v.nullable(v.string())),
  avatar: v.optional(v.nullable(v.string())),
  homePath: v.optional(v.nullable(v.string())),
  enabled: v.optional(enabledSchema),
  roleIds: v.optional(v.array(idSchema))
});
export type UserUpdateDTO = v.InferOutput<typeof userUpdateSchema>;

export const userQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    username: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    fullName: v.optional(v.string()),
    enabled: v.optional(enabledSchema)
  })
]);
export type UserQuery = v.InferOutput<typeof userQuerySchema>;

export const userBatchDeleteSchema = batchDeleteSchema;
export const userIdParamSchema = idParamSchema;

/** 修改密码（当前登录用户） */
export const modifyPasswordSchema = v.object({
  currentPassword: v.pipe(v.string(), v.nonEmpty()),
  newPassword: v.pipe(v.string(), v.nonEmpty())
});

/** 用户分配角色（v3 §6.3 user 分配角色） */
export const userRoleAssignSchema = v.object({ roleIds: v.array(idSchema) });
