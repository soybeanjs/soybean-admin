import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { loginSchema } from '@/schema/auth';

/**
 * `POST /api/auth/login` —— 用户名密码登录（公开）。
 *
 * 校验走 valibot `loginSchema`（grantType 默认 pwd；captcha 类型预留字段），
 * 成功返回 token 对 + 用户安全视图。失败经 AppError（PASSWORD_INVALID 等）
 * 由全局错误中间件归一为业务码响应。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '用户登录',
    description: '用户名密码登录，返回 access token、refresh token 与用户安全视图。',
    responses: { 200: { description: '登录成功' } }
  }),
  validate('json', loginSchema),
  async c => {
    const body = c.req.valid('json');
    const result = await authService.login(body.userName, body.password);

    return c.json(result);
  }
);
