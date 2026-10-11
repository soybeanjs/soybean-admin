import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { menuExistPathResultSchema, menuExistPathSchema } from '@/schema/menu';

/**
 * `POST /api/menu/exist-path` —— 路由存在性检查（前端 NotFound 403/404 判定用）。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '检查菜单路由是否存在',
    description: '检查 routeName / routePath 是否已被其它路由菜单占用。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuExistPathResultSchema) } }
      }
    }
  }),
  validate('json', menuExistPathSchema),
  c => {
    const { routeName, routePath } = c.req.valid('json');

    return c.json({ exists: menuService.isMenuRouteExist(routeName, routePath) });
  }
);
