import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { resetPasswordSchema } from '@/schema/auth';

/**
 * `POST /api/auth/reset-password` —— 重置密码（公开）。
 *
 * 无短信通道，凭证用图形验证码承担（与 v2 `reset-pwd` 页面语义一致）。
 * 校验通过后直接覆写密码；需重新登录（不自动签发 token）。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '重置密码',
    description: '凭用户名 + 图形验证码重置密码，成功后需用新密码登录。',
    responses: { 200: { description: '重置成功' } }
  }),
  validate('json', resetPasswordSchema),
  async c => {
    const body = c.req.valid('json');

    await authService.resetPassword(body.userName, body.password, body.captchaId, body.captchaCode);

    return c.json(null);
  }
);
