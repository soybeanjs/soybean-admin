import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { authService } from '@/services/auth.service';
import { authUserSchema } from '@/schema/auth';

/** `GET /api/auth/user-info` —— 当前登录用户信息（需登录，无权限码要求） 详见 docs/v3-notes.md N-092。 */
export const GET = defineHandler(
  describeRoute({
    tags: ['认证'],
    summary: '获取当前用户信息',
    description: '按 access token 返回当前登录用户的安全视图（含角色码与按钮权限码）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(authUserSchema) } }
      }
    }
  }),
  async c => {
    const userId = c.get('userId');
    const user = await authService.getUserInfo(userId);

    return c.json(user);
  }
);
