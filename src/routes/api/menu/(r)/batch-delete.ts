import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/menu/batch-delete` —— 批量删除菜单。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '批量删除菜单',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    menuService.batchDeleteMenus(ids);

    return c.json(null);
  }
);
