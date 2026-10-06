import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { refreshTokenSchema } from '@/schema/auth';

/**
 * `POST /api/auth/refresh-token` —— 刷新令牌（公开，凭 refreshToken 换新 token 对）。
 *
 * 旧 refreshToken 立即拉黑防重放；黑名单中的 token 抛 REFRESH_TOKEN_BLACKLISTED。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '刷新令牌',
    description: '用 refreshToken 换取新的 token 对；旧 refreshToken 立即失效。',
    responses: { 200: { description: '刷新成功' } }
  }),
  validate('json', refreshTokenSchema),
  async c => {
    const body = c.req.valid('json');
    const result = await authService.refreshToken(body.refreshToken);

    return c.json(result);
  }
);
