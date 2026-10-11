import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { menuService } from '@/services/menu.service';
import { menuTreeListSchema } from '@/schema/menu';

/**
 * `GET /api/menu/tree` —— 全量菜单树（管理端）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '全量菜单树',
    description: '返回全部菜单组成的树，children 递归向下。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuTreeListSchema) } }
      }
    }
  }),
  c => c.json(menuService.getMenuTree())
);
