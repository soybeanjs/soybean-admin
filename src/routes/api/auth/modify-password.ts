import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { nullDataSchema } from '@/schema/_shared';
import { modifyPasswordSchema } from '@/schema/user';

/** `POST /api/auth/modify-password` —— 当前用户修改密码（需登录） 详见 docs/v3-notes.md N-087。 */
export const POST = defineHandler(
  describeRoute({
    tags: ['认证'],
    summary: '修改当前用户密码',
    description: '校验当前密码后设置新密码；data 恒为 null。',
    responses: {
      200: {
        description: '修改成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', modifyPasswordSchema),
  async c => {
    const body = c.req.valid('json');
    const userId = c.get('userId');

    await userService.modifyPassword(userId, body.currentPassword, body.newPassword);

    return c.json(null);
  }
);
