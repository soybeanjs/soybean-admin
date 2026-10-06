import { defineHandler, describeRoute } from 'ubean/server';
import { menuService } from '@/services/menu.service';

/**
 * `GET /api/menu/user` —— 当前用户可见菜单（dynamic 路由模式数据源）。
 *
 * 返回启用状态且用户有权访问的菜单行（含公共菜单与经权限码授权的菜单，
 * 自动补齐祖先链），前端 `transformMenusToAutoRoutes` 据此生成路由。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Menu'],
    summary: '当前用户菜单',
    responses: { 200: { description: '用户可见菜单行' } }
  }),
  async c => {
    const userId = c.get('userId');

    return c.json(menuService.getUserMenus(userId));
  }
);
