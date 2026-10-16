import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { createCaptcha } from '@/services/captcha.service';
import { captchaResultSchema } from '@/schema/auth';

/** `GET /api/auth/captcha` —— 获取图形验证码（公开） 详见 docs/v3-notes.md N-083。 */
export const GET = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '获取图形验证码',
    description: '返回验证码标识与 SVG 图片（data URL），答案缓存 5 分钟、一次性消费。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(captchaResultSchema) } }
      }
    }
  }),
  async c => c.json(await createCaptcha())
);
