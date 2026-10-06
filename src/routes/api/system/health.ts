import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { APP_VERSION } from '@/constants';
import { healthInfoSchema } from '@/schema/system';

/**
 * `GET /api/system/health` —— 服务健康检查。
 *
 * ubean 0.6.0 的 API 路由约定：
 * - 文件路径即路由路径（`src/routes/api/system/health.ts` → `/api/system/health`）；
 * - 用 **void 风格命名导出** HTTP 方法（`export const GET`），不用 `.get.ts` 后缀；
 * - 链路固定为 `defineHandler(defineHandlerMeta?, describeRoute?, validator?, handler)`：
 *   `defineHandlerMeta` 负责鉴权/缓存/限流，`describeRoute` 负责 OpenAPI 元数据
 *   （它从 `hono-openapi` 重导出，不经 ubean 透传）。
 *
 * ⚠️ `defineHandler` 的默认 `requiresAuth` 是 **true**。健康检查必须显式
 * 声明 `requiresAuth: false`，否则会被鉴权拦截。
 */
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
