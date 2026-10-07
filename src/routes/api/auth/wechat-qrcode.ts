import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { authService } from '@/services/auth.service';

/**
 * `GET /api/auth/wechat-qrcode` —— 获取微信绑定二维码（公开，mock）。
 *
 * 无微信开放平台凭证，返回自建 `ticket`（KV 存储，TTL 5 分钟）与形似官方
 * `qrconnect` 的授权 url；前端据此渲染二维码占位，「模拟扫码」调
 * `POST /api/auth/bind-wechat` 完成绑定。
 */
export const GET = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '获取微信绑定二维码',
    description: '返回二维码 ticket 与授权 url（mock，无真实开放平台凭证）。',
    responses: { 200: { description: '返回二维码信息' } }
  }),
  async c => c.json(await authService.createWechatQrcode())
);
