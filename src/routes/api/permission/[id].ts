import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { permissionUpdateSchema } from '@/schema/permission';

/**
 * `GET /api/permission/:id` —— 权详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '权详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(permissionService.getPermissionById(requireParam(c, 'id')))
);

/**
 * `PUT /api/permission/:id` —— 更新权。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '更新权',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', permissionUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(permissionService.updatePermission(id, body));
  }
);

/**
 * `DELETE /api/permission/:id` —— 删除权（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '删除权',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    permissionService.deletePermission(requireParam(c, 'id'));

    return c.json(null);
  }
);
