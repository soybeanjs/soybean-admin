import { defineHandler, describeRoute } from 'ubean/server';
import { menuService } from '@/services/menu.service';

/**
 * `GET /api/menu/all` —— 菜单全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '菜单全量列表',
    responses: { 200: { description: '全量记录' } }
  }),
  c => c.json(menuService.getMenus())
);
