import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { userCreateSchema } from '@/schema/user';

/**
 * `POST /api/user` —— 新增用。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '新增用',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', userCreateSchema),
  async c => {
    const body = c.req.valid('json');

    return c.json(await userService.createUser(body));
  }
);
