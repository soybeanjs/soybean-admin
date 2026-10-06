import { defineHandler, describeRoute } from 'ubean/server';
import { menuService } from '@/services/menu.service';

/**
 * `GET /api/menu/tree` —— 全量菜单树（管理端）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Menu'],
    summary: '全量菜单树',
    responses: { 200: { description: '菜单树' } }
  }),
  c => c.json(menuService.getMenuTree())
);
