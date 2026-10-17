import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { currentActor } from '@/shared/actor';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { userCreateSchema, userResourceSchema } from '@/schema/user';

/**
 * `POST /api/user` —— 新增用户。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '新增用户',
    description: '新增用户，可同时绑定角色；响应不含 password。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(userResourceSchema) } }
      }
    }
  }),
  validate('json', userCreateSchema),
  async c => {
    const body = c.req.valid('json');

    return c.json(await userService.createUser(body, currentActor(c)));
  }
);
