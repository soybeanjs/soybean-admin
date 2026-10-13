import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/role/batch-delete` —— 批量删除角色。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '批量删除角色',
    description: '按主键列表批量软删角色（enabled 置为 D）；data 恒为 null。',
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

    await roleService.batchDeleteRoles(ids);

    return c.json(null);
  }
);
