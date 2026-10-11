import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { permissionService } from '@/services/permission.service';
import { permissionListSchema } from '@/schema/permission';

/**
 * `GET /api/permission/role/:id` —— 角色已分配的权限列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '角色权限列表',
    description: '返回指定角色已绑定的权限点列表。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(permissionListSchema) } }
      }
    }
  }),
  c => c.json(permissionService.getRolePermissions(requireParam(c, 'id')))
);
