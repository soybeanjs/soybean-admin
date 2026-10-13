import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { nullDataSchema } from '@/schema/_shared';
import { userDetailSchema, userResourceSchema, userUpdateSchema } from '@/schema/user';

/**
 * `GET /api/user/:id` —— 用户详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '用户详情',
    description: '按主键查询单个用户；该端点刻意返回整行（含 password），仅管理端使用。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(userDetailSchema) } }
      }
    }
  }),
  c => c.json(userService.getUserById(requireParam(c, 'id')))
);

/**
 * `PUT /api/user/:id` —— 更新用户。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '更新用户',
    description: '按主键更新用户（字段全部可选，未传字段保留原值）；响应不含 password。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(userResourceSchema) } }
      }
    }
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
    summary: '删除用户',
    description: '按主键软删用户（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  async c => {
    await userService.deleteUser(requireParam(c, 'id'));

    return c.json(null);
  }
);
