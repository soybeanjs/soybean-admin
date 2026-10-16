import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { AppError } from '@/shared/error';
import { authService } from '@/services/auth.service';
import { nullDataSchema } from '@/schema/_shared';

/** `POST /api/auth/logout` —— 登出（需登录） 详见 docs/v3-notes.md N-086。 */
export const POST = defineHandler(
  describeRoute({
    tags: ['认证'],
    summary: '退出登录',
    description: '拉黑当前 access token 与 refreshToken，使其立即失效；data 恒为 null。',
    responses: {
      200: {
        description: '退出成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  async c => {
    const authorization = c.req.header('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AppError('UNAUTHORIZED', '未登录或令牌缺失');
    }

    await authService.logout(authorization.slice(7));

    return c.json(null);
  }
);
