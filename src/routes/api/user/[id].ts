import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { userUpdateSchema } from '@/schema/user';

/**
 * `GET /api/user/:id` —— 用详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '用详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(userService.getUserById(requireParam(c, 'id')))
);

/**
 * `PUT /api/user/:id` —— 更新用。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '更新用',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', userUpdateSchema),
  async c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(await userService.updateUser(id, body));
  }
);

/**
 * `DELETE /api/user/:id` —— 删除用（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '删除用',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    userService.deleteUser(requireParam(c, 'id'));

    return c.json(null);
  }
);
