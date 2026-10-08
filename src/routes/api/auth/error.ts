import { defineHandler, defineHandlerMeta, describeRoute } from 'ubean/server';
import { demoErrorCodeMap } from '@/constants/error-code';
import { AppError } from '@/shared/error';
import { validate } from '@/shared/validate';
import { demoErrorQuerySchema } from '@/schema/auth';

/**
 * `POST /api/auth/error` —— 错误归一演示（P3-06，v3 §4.6）。
 *
 * 请求演示页按 `?code=` 逐条触发请求层的四类分派：
 * - `8888` → `DEMO_LOGOUT`，命中 `VITE_SERVICE_LOGOUT_CODES` → 静默登出；
 * - `7777` → `DEMO_MODAL_LOGOUT`，命中弹窗登出码 → `dialog.warning` 后登出；
 * - `9999` → `DEMO_REFRESH_TOKEN`，命中过期码 → 单飞刷新 + 重放；
 * - 不传 / 未登记 → `SYSTEM_ERROR`（`1000`）普通报错（3s 同文案去重）。
 *
 * 注意本端点**公开**（在鉴权中间件的 `PUBLIC_API_PATHS` 里），因此演示
 * 「令牌过期」不需要真实 token —— 请求层拿到 9999 会走刷新链路，刷新失败
 * 再回到这里重新报错（演示链路要看的正是这一段）。
 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['Auth'],
    summary: '错误归一演示',
    description: '按 query.code 抛出演示用业务错误，验证全局错误中间件输出业务码结构与请求层分派。',
    responses: {
      200: { description: '始终返回业务错误响应；code=8888/7777/9999 时返回对应演示码' }
    }
  }),
  validate('query', demoErrorQuerySchema),
  c => {
    const { code } = c.req.valid('query');
    const codeKey = demoErrorCodeMap[code];

    if (!codeKey) {
      throw new AppError('SYSTEM_ERROR', '演示错误：这是错误归一端点的示例输出');
    }

    throw new AppError(codeKey);
  }
);
