import { defineHandler, describeRoute } from 'ubean/server';
import * as v from 'valibot';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';

const existPathSchema = v.object({
  routeName: v.optional(v.string()),
  routePath: v.optional(v.string())
});

/**
 * `POST /api/menu/exist-path` —— 路由存在性检查（前端 NotFound 403/404 判定用）。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['Menu'],
    summary: '检查菜单路由是否存在',
    responses: { 200: { description: '存在为 true' } }
  }),
  validate('json', existPathSchema),
  c => {
    const { routeName, routePath } = c.req.valid('json');

    return c.json({ exists: menuService.isMenuRouteExist(routeName, routePath) });
  }
);
