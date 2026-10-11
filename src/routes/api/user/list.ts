import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { userQuerySchema } from '@/schema/user';

/**
 * `GET /api/user/list` —— 用户分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '用户分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', userQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(userService.getUserList(query));
  }
);
