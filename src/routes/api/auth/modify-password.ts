import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { modifyPasswordSchema } from '@/schema/user';

/**
 * `POST /api/auth/modify-password` —— 当前用户修改密码（需登录）。
 *
 * 校验 currentPassword 后更新；成功后旧 token 不强制失效（客户端自行重新登录）。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['Auth'],
    summary: '修改当前用户密码',
    description: '校验当前密码后设置新密码。',
    responses: { 200: { description: '修改成功' } }
  }),
  validate('json', modifyPasswordSchema),
  async c => {
    const body = c.req.valid('json');
    const userId = c.get('userId');

    await userService.modifyPassword(userId, body.currentPassword, body.newPassword);

    return c.json(null);
  }
);
