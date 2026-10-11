import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { authService } from '@/services/auth.service';
import { bindWechatSchema, wechatBindingSchema } from '@/schema/auth';

/**
 * `GET /api/auth/bind-wechat` —— 查询当前用户微信绑定状态（需登录）。
 * `POST /api/auth/bind-wechat` —— 完成微信绑定（需登录，mock）。
 *
 * mock 语义：ticket 由 `GET /api/auth/wechat-qrcode` 下发并缓存，POST 时
 * 校验 ticket 有效即视为「扫码成功」，按 userId 派生稳定假昵称落 KV。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['认证'],
    summary: '查询微信绑定状态',
    description: '返回当前登录用户是否已绑定微信及绑定昵称（mock）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(wechatBindingSchema) } }
      }
    }
  }),
  async c => c.json(await authService.getWechatBinding(c.get('userId')))
);

export const POST = defineHandler(
  describeRoute({
    tags: ['认证'],
    summary: '绑定微信',
    description: '校验二维码 ticket 后绑定微信并返回绑定结果（mock，无真实开放平台凭证）。',
    responses: {
      200: {
        description: '绑定成功',
        content: { 'application/json': { schema: resolver(wechatBindingSchema) } }
      }
    }
  }),
  validate('json', bindWechatSchema),
  async c => {
    const body = c.req.valid('json');

    return c.json(await authService.bindWechat(c.get('userId'), body.ticket));
  }
);
