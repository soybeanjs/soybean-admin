import { defineHandler, describeRoute } from 'ubean/server';
import { authService } from '@/services/auth.service';

/**
 * `GET /api/auth/user-info` —— 当前登录用户信息（需登录，无权限码要求）。
 *
 * 用户上下文由鉴权中间件写入；roles 在服务层按用户-角色关联展开。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Auth'],
    summary: '获取当前用户信息',
    description: '按 access token 返回当前登录用户的安全视图（含角色码）。',
    responses: { 200: { description: '返回用户信息' } }
  }),
  async c => {
    const userId = c.get('userId');
    const user = await authService.getUserInfo(userId);

    return c.json(user);
  }
);
