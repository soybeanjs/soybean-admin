import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { permissionQuerySchema } from '@/schema/permission';

/**
 * `GET /api/permission/list` —— 权限分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '权限分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', permissionQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(permissionService.getPermissionList(query));
  }
);
