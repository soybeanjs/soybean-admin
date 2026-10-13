import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { nullDataSchema } from '@/schema/_shared';
import { permissionResourceSchema, permissionUpdateSchema } from '@/schema/permission';

/**
 * `GET /api/permission/:id` —— 权限详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '权限点详情',
    description: '按主键查询单个权限点。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(permissionResourceSchema) } }
      }
    }
  }),
  c => c.json(permissionService.getPermissionById(requireParam(c, 'id')))
);

/**
 * `PUT /api/permission/:id` —— 更新权限。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '更新权限点',
    description: '按主键更新权限点（字段全部可选，未传字段保留原值）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(permissionResourceSchema) } }
      }
    }
  }),
  validate('json', permissionUpdateSchema),
  async c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(await permissionService.updatePermission(id, body));
  }
);

/**
 * `DELETE /api/permission/:id` —— 删除权（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '删除权限点',
    description: '按主键软删权限点（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  async c => {
    await permissionService.deletePermission(requireParam(c, 'id'));

    return c.json(null);
  }
);
