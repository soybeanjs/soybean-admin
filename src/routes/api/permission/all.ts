import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { permissionService } from '@/services/permission.service';
import { permissionListSchema } from '@/schema/permission';

/**
 * `GET /api/permission/all` —— 权限全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '权限点全量列表',
    description: '返回全部权限点（未分页），供角色授权时选择。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(permissionListSchema) } }
      }
    }
  }),
  c => c.json(permissionService.getAllPermissions())
);
