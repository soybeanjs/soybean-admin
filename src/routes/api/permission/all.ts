import { defineHandler, describeRoute } from 'ubean/server';
import { permissionService } from '@/services/permission.service';

/**
 * `GET /api/permission/all` —— 权限全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '权限全量列表',
    responses: { 200: { description: '全量记录' } }
  }),
  c => c.json(permissionService.getAllPermissions())
);
