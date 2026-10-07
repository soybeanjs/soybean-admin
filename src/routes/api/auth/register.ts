import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { registerSchema } from '@/schema/auth';

/**
 * `POST /api/auth/register` —— 用户注册（公开）。
 *
 * 注册成功直接返回 token 对（unify 范式：注册即登录）。
 * 用户名重复抛 USERNAME_EXISTS。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '用户注册',
    description: '用户名密码注册，成功后直接返回 token 对与用户安全视图。',
    responses: { 200: { description: '注册成功' } }
  }),
  validate('json', registerSchema),
  async c => {
    const body = c.req.valid('json');
    const result = await authService.register(body.userName, body.password, {
      email: body.email,
      fullName: body.fullName
    });

    return c.json(result);
  }
);
