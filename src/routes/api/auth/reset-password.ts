import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { nullDataSchema } from '@/schema/_shared';
import { resetPasswordSchema } from '@/schema/auth';

/** `POST /api/auth/reset-password` —— 重置密码（公开） 详见 docs/v3-notes.md N-091。 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '重置密码',
    description: '凭用户名 + 图形验证码重置密码，成功后需用新密码登录；data 恒为 null。',
    responses: {
      200: {
        description: '重置成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', resetPasswordSchema),
  async c => {
    const body = c.req.valid('json');

    await authService.resetPassword(body.userName, body.password, body.captchaId, body.captchaCode);

    return c.json(null);
  }
);
