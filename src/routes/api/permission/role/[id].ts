import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { permissionService } from '@/services/permission.service';

/**
 * `GET /api/permission/role/:id` —— 角色已分配的权限列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Permission'],
    summary: '角色权限列表',
    responses: { 200: { description: '权限记录列表' } }
  }),
  c => c.json(permissionService.getRolePermissions(requireParam(c, 'id')))
);
