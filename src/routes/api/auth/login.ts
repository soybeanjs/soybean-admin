import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { loginResultSchema, loginSchema } from '@/schema/auth';

/** `POST /api/auth/login` —— 用户名密码登录（公开） 详见 docs/v3-notes.md N-085。 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '用户登录',
    description: '密码登录（可带图形验证码）或图形验证码登录，返回 access token、refresh token 与用户安全视图。',
    responses: {
      200: {
        description: '登录成功',
        content: { 'application/json': { schema: resolver(loginResultSchema) } }
      }
    }
  }),
  validate('json', loginSchema),
  async c => {
    const body = c.req.valid('json');
    const result =
      body.grantType === 'captcha'
        ? await authService.loginByCaptcha(body.userName, body.captchaId, body.captchaCode)
        : await authService.login(body.userName, body.password, {
            captchaId: body.captchaId ?? '',
            captchaCode: body.captchaCode ?? ''
          });

    return c.json(result);
  }
);
