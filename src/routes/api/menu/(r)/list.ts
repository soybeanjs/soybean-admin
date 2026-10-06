import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { menuQuerySchema } from '@/schema/menu';

/**
 * `GET /api/menu/list` —— 菜单分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '菜单分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', menuQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(menuService.getMenuList(query));
  }
);
