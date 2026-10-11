import { defineHandler, describeRoute } from 'ubean/server';
import { roleService } from '@/services/role.service';

/**
 * `GET /api/role/all` —— 角色全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角色全量列表',
    responses: { 200: { description: '全量记录' } }
  }),
  c => c.json(roleService.getAllRoles())
);
