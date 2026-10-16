import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { authService } from '@/services/auth.service';
import { wechatQrcodeSchema } from '@/schema/auth';

/** `GET /api/auth/wechat-qrcode` —— 获取微信绑定二维码（公开，mock） 详见 docs/v3-notes.md N-093。 */
export const GET = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '获取微信绑定二维码',
    description: '返回二维码 ticket 与授权 url（mock，无真实开放平台凭证）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(wechatQrcodeSchema) } }
      }
    }
  }),
  async c => c.json(await authService.createWechatQrcode())
);
