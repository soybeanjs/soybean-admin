import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { menuUpdateSchema } from '@/schema/menu';

/**
 * `GET /api/menu/:id` —— 菜详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '菜详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(menuService.getMenuById(requireParam(c, 'id')))
);

/**
 * `PUT /api/menu/:id` —— 更新菜。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '更新菜',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', menuUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(menuService.updateMenu(id, body));
  }
);

/**
 * `DELETE /api/menu/:id` —— 删除菜（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '删除菜',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    menuService.deleteMenu(requireParam(c, 'id'));

    return c.json(null);
  }
);
