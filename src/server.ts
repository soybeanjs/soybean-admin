import { defineServer } from 'ubean/server';
import { errorMiddleware } from '@/middleware/03.error';
import { serverEnv } from '@/env.server';

/**
 * 服务端入口（ubean 约定：`src/server.ts`）。
 *
 * 只做进程级配置与钩子；业务逻辑放 `src/routes/**`（API）、
 * `src/middleware/**`（中间件）、`src/services/**`、`src/db/**`。
 *
 * 全局错误映射（P1-11）：框架级 onError 输出 `{ error, statusCode, data }`，
 * 与业务码 `{ code, message, data }` 不同构。插件 setup 拿到 hono 实例后注册
 * 应用级 onError（hono 单槽、后注册覆盖先注册），统一归一为 AppError 业务码。
 *
 * 注：`hooks` / `globalHooks` 是 Hono 级别的钩子；启动日志走标准输出
 * （ubean CLI 在 dev 下自带请求/生命周期日志，见 `ubean.config.ts` 的 `logging`）。
 */
export default defineServer({
  hooks: {},
  plugins: [
    {
      name: 'api-error-handler',
      setup: app => {
        app.hono.onError(errorMiddleware);
      }
    }
  ],
  onServerReady: async () => {
    console.log(`[soybean-admin] server ready at ${serverEnv.SERVER_HOST}:${serverEnv.SERVER_PORT}`);
  }
});
