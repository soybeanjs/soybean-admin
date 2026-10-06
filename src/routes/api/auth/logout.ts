import { defineHandler, describeRoute } from 'ubean/server';
import { AppError } from '@/shared/error';
import { authService } from '@/services/auth.service';

/**
 * `POST /api/auth/logout` —— 登出（需登录）。
 *
 * access token 拉黑 1h、refreshToken 拉黑 7d；token 已失效时幂等返回成功。
 * 用户上下文由鉴权中间件写入（c.get('userId')）。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['Auth'],
    summary: '退出登录',
    description: '拉黑当前 access token 与 refreshToken，使其立即失效。',
    responses: { 200: { description: '登出成功' } }
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
