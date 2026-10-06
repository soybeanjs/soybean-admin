import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { AppError } from '@/shared/error';

/**
 * `POST /api/auth/error` —— 错误归一演示端点（公开）。
 *
 * 抛业务 AppError，验证全局 onError 输出 `{ code, message, data }`；
 * 前端/集成测试用它确认错误链路（P1-03）。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '错误归一演示',
    description: '抛出演示用业务错误，验证全局错误中间件输出业务码结构。',
    responses: { 200: { description: '始终返回业务错误响应' } }
  }),
  async () => {
    throw new AppError('SYSTEM_ERROR', '演示错误：这是错误归一端点的示例输出');
  }
);
