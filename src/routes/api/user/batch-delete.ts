import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/user/batch-delete` —— 批量删除用户。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '批量删除用户',
    description: '按主键列表批量软删用户（enabled 置为 D）；data 恒为 null。',
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

    await userService.batchDeleteUsers(ids);

    return c.json(null);
  }
);
