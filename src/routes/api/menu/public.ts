import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { menuService } from '@/services/menu.service';
import { menuListSchema } from '@/schema/menu';

/**
 * `GET /api/menu/public` —— 公开菜单（requiresAuth='N'）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '公开菜单列表',
    description: '返回免登录可见的菜单行（requiresAuth=N 且启用），自动补齐祖先链。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuListSchema) } }
      }
    }
  }),
  c => c.json(menuService.getPublicMenus())
);
