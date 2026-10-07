import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { createCaptcha } from '@/services/captcha.service';

/**
 * `GET /api/auth/captcha` —— 获取图形验证码（公开）。
 *
 * 返回 `{ captchaId, img }`：`img` 是自绘 SVG 的 base64 data URL，可直接塞进
 * `<img :src>`；答案存 `useKV('captcha')`（TTL 5 分钟），校验一次即消费。
 * 供密码登录（可开关）与验证码登录/重置密码使用。
 */
export const GET = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '获取图形验证码',
    description: '返回验证码标识与 SVG 图片（data URL），答案缓存 5 分钟、一次性消费。',
    responses: { 200: { description: '返回验证码' } }
  }),
  async c => c.json(await createCaptcha())
);
