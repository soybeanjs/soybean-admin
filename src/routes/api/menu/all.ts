import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { menuService } from '@/services/menu.service';
import { menuListSchema } from '@/schema/menu';

/**
 * `GET /api/menu/all` —— 菜单全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '菜单全量列表',
    description: '返回全部菜单行（按更新时间倒序），供管理端构建菜单树。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuListSchema) } }
      }
    }
  }),
  c => c.json(menuService.getMenus())
);
