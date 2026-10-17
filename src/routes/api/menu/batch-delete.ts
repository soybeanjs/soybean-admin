import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/menu/batch-delete` —— 批量删除菜单。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '批量删除菜单',
    description: '按主键列表批量软删菜单（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', batchDeleteSchema),
  async c => {
    const { ids } = c.req.valid('json');

    await menuService.batchDeleteMenus(ids);

    return c.json(null);
  }
);
