import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { loginResultSchema, refreshTokenSchema } from '@/schema/auth';

/** `POST /api/auth/refresh-token` —— 刷新令牌（公开，凭 refreshToken 换新 token 对） 详见 docs/v3-notes.md N-089。 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '刷新令牌',
    description: '用 refreshToken 换取新的 token 对；旧 refreshToken 立即失效。',
    responses: {
      200: {
        description: '刷新成功',
        content: { 'application/json': { schema: resolver(loginResultSchema) } }
      }
    }
  }),
  validate('json', refreshTokenSchema),
  async c => {
    const body = c.req.valid('json');
    const result = await authService.refreshToken(body.refreshToken);

    return c.json(result);
  }
);
