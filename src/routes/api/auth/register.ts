import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { loginResultSchema, registerSchema } from '@/schema/auth';

/** `POST /api/auth/register` —— 用户注册（公开） 详见 docs/v3-notes.md N-090。 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '用户注册',
    description: '用户名密码注册，成功后直接返回 token 对与用户安全视图。',
    responses: {
      200: {
        description: '注册成功',
        content: { 'application/json': { schema: resolver(loginResultSchema) } }
      }
    }
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
