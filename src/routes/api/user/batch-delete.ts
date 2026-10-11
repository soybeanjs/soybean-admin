import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/user/batch-delete` —— 批量删除用户。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '批量删除用户',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    userService.batchDeleteUsers(ids);

    return c.json(null);
  }
);
