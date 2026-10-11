import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { roleService } from '@/services/role.service';
import { roleListSchema } from '@/schema/role';

/**
 * `GET /api/role/user` —— 当前用户角色码列表（登录后路由守卫初始化用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '当前用户角色列表',
    description: '按 access token 返回当前用户的角色记录（含角色码 code）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(roleListSchema) } }
      }
    }
  }),
  async c => {
    const userId = c.get('userId');
    const roles = roleService.getRolesByUserId(userId);

    return c.json(roles);
  }
);
