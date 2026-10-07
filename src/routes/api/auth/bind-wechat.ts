import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { bindWechatSchema } from '@/schema/auth';

/**
 * `GET /api/auth/bind-wechat` —— 查询当前用户微信绑定状态（需登录）。
 * `POST /api/auth/bind-wechat` —— 完成微信绑定（需登录，mock）。
 *
 * mock 语义：ticket 由 `GET /api/auth/wechat-qrcode` 下发并缓存，POST 时
 * 校验 ticket 有效即视为「扫码成功」，按 userId 派生稳定假昵称落 KV。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['Auth'],
    summary: '查询微信绑定状态',
    description: '返回当前用户是否已绑定微信及绑定昵称。',
    responses: { 200: { description: '返回绑定状态' } }
  }),
  async c => c.json(await authService.getWechatBinding(c.get('userId')))
);

export const POST = defineHandler(
  describeRoute({
    tags: ['Auth'],
    summary: '绑定微信（mock）',
    description: '校验二维码 ticket 后绑定，返回绑定结果与昵称。',
    responses: { 200: { description: '绑定成功' } }
  }),
  validate('json', bindWechatSchema),
  async c => {
    const body = c.req.valid('json');

    return c.json(await authService.bindWechat(c.get('userId'), body.ticket));
  }
);
