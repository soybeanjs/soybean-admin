import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { currentActor } from '@/shared/actor';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { nullDataSchema } from '@/schema/_shared';
import { roleDetailSchema, roleResourceSchema, roleUpdateSchema } from '@/schema/role';

/**
 * `GET /api/role/:id` —— 角色详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角色详情',
    description: '按主键查询角色详情（含已绑定的权限点摘要）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(roleDetailSchema) } }
      }
    }
  }),
  c => c.json(roleService.getRoleDetailById(requireParam(c, 'id')))
);

/**
 * `PUT /api/role/:id` —— 更新角色。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '更新角色',
    description: '按主键更新角色（字段全部可选，未传字段保留原值）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(roleResourceSchema) } }
      }
    }
  }),
  validate('json', roleUpdateSchema),
  async c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(await roleService.updateRole(id, body, currentActor(c)));
  }
);

/**
 * `DELETE /api/role/:id` —— 删除角（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '删除角色',
    description: '按主键软删角色（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  async c => {
    await roleService.deleteRole(requireParam(c, 'id'));

    return c.json(null);
  }
);
