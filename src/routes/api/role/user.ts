import { defineHandler, describeRoute } from 'ubean/server';
import { roleService } from '@/services/role.service';

/**
 * `GET /api/role/user` —— 当前用户角色码列表（登录后路由守卫初始化用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Role'],
    summary: '当前用户角色列表',
    description: '按 access token 返回当前用户的角色记录（含角色码 code）。',
    responses: { 200: { description: '角色列表' } }
  }),
  async c => {
    const userId = c.get('userId');
    const roles = roleService.getRolesByUserId(userId);

    return c.json(roles);
  }
);
