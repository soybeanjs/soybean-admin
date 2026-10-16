import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { APP_VERSION } from '@/constants';
import { healthInfoSchema } from '@/schema/system';

/** ubean 0.6.0 的 API 路由约定： 详见 docs/v3-notes.md N-095。 */
export const GET = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['System'],
    summary: '服务健康检查',
    description: '返回服务健康状态、应用版本与服务器时间戳。无需鉴权。',
    responses: {
      200: {
        description: '服务正常',
        content: { 'application/json': { schema: resolver(healthInfoSchema) } }
      }
    }
  }),
  c =>
    c.json({
      status: 'ok' as const,
      version: APP_VERSION,
      timestamp: Date.now()
    })
);
