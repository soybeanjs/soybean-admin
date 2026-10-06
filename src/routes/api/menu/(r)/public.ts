import { defineHandler, describeRoute } from 'ubean/server';
import { menuService } from '@/services/menu.service';

/**
 * `GET /api/menu/public` —— 公开菜单（requiresAuth='N'）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Menu'],
    summary: '公开菜单列表',
    responses: { 200: { description: '公开菜单行' } }
  }),
  c => c.json(menuService.getPublicMenus())
);
