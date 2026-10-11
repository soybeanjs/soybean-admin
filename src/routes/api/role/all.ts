import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { roleService } from '@/services/role.service';
import { roleListSchema } from '@/schema/role';

/**
 * `GET /api/role/all` —— 角色全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角色全量列表',
    description: '返回全部角色（未分页），供用户 / 组织绑定角色选择。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(roleListSchema) } }
      }
    }
  }),
  c => c.json(roleService.getAllRoles())
);
