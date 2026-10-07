import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { loginSchema } from '@/schema/auth';

/**
 * `POST /api/auth/login` —— 用户名密码登录（公开）。
 *
 * 校验走 valibot `loginSchema`（联合类型：`grantType: 'pwd'` 密码登录 / `'captcha'`
 * 图形验证码登录），成功返回 token 对 + 用户安全视图。失败经 AppError（PASSWORD_INVALID /
 * CAPTCHA_INVALID 等）由全局错误中间件归一为业务码响应。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '用户登录',
    description: '密码登录（可带图形验证码）或图形验证码登录，返回 access token、refresh token 与用户安全视图。',
    responses: { 200: { description: '登录成功' } }
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
