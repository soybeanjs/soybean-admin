import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { menuCreateSchema } from '@/schema/menu';

/**
 * `POST /api/menu` —— 新增菜。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '新增菜',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', menuCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(menuService.createMenu(body));
  }
);
