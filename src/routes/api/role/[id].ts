import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { roleUpdateSchema } from '@/schema/role';

/**
 * `GET /api/role/:id` —— 角详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(roleService.getRoleDetailById(requireParam(c, 'id')))
);

/**
 * `PUT /api/role/:id` —— 更新角。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '更新角',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', roleUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(roleService.updateRole(id, body));
  }
);

/**
 * `DELETE /api/role/:id` —— 删除角（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '删除角',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    roleService.deleteRole(requireParam(c, 'id'));

    return c.json(null);
  }
);
