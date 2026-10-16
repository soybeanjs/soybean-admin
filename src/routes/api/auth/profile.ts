import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { profileUpdateSchema } from '@/schema/profile';
import { userProfileSchema } from '@/schema/user';

/** `PUT /api/auth/profile` —— 当前登录用户自助更新个人资料（P3-09） 详见 docs/v3-notes.md N-088。 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['认证'],
    summary: '更新当前用户资料',
    description:
      '按 access token 更新当前登录用户的可编辑资料字段（不含状态与角色），返回资料视图（含角色码与按钮权限码）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(userProfileSchema) } }
      }
    }
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
