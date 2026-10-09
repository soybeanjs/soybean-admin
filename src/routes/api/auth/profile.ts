import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { profileUpdateSchema } from '@/schema/profile';

/**
 * `PUT /api/auth/profile` —— 当前登录用户自助更新个人资料（P3-09）。
 *
 * 为什么单独开这个端点而不是复用 `PUT /api/user/:id`：manage 的 user 更新
 * 接口是**管理员**语义（可改 `enabled` / `roleIds` / 替别人改密码），走 RBAC
 * 权限码校验；个人中心只允许改自己的展示字段，且不能碰状态与角色。两者放同
 * 一个 handler 会让「自助」与「管理」的权限边界模糊，也逼前端把当前用户 id
 * 当参数传来传去。
 *
 * 认证中间件对 `/api/auth/` 前缀只要求登录、不做权限码校验，正好匹配这个语义。
 * `userId` 只从 token 上下文取（不接受 body 里的 id），越权面为零。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['Auth'],
    summary: '更新当前用户资料',
    description: '按 access token 更新当前登录用户的可编辑资料字段（不含状态与角色）。',
    responses: { 200: { description: '返回更新后的用户信息' } }
  }),
  validate('json', profileUpdateSchema),
  async c => {
    const userId = c.get('userId');
    const body = c.req.valid('json');

    await userService.updateUser(userId, {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      homePath: body.homePath,
      description: body.description
    });

    return c.json(await userService.getProfile(userId));
  }
);
