import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { menuService } from '@/services/menu.service';
import { menuListSchema } from '@/schema/menu';

/**
 * `GET /api/menu/user` —— 当前用户可见菜单（dynamic 路由模式数据源）。
 *
 * 返回启用状态且用户有权访问的菜单行（含公共菜单与经权限码授权的菜单，
 * 自动补齐祖先链），前端 `transformMenusToAutoRoutes` 据此生成路由。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '当前用户菜单',
    description: '按 access token 返回当前用户可见菜单行（含公共菜单与经权限码授权的菜单，自动补齐祖先链）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuListSchema) } }
      }
    }
  }),
  async c => {
    const userId = c.get('userId');

    return c.json(menuService.getUserMenus(userId));
  }
);
