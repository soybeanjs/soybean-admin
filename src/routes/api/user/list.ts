import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { userPageSchema, userQuerySchema } from '@/schema/user';

/**
 * `GET /api/user/list` —— 用户分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '用户分页列表',
    description: '按用户名、手机号、邮箱、姓名、状态筛选，返回分页用户（含已绑角色 ID，不含 password）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(userPageSchema) } }
      }
    }
  }),
  validate('query', userQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(userService.getUserList(query));
  }
);
