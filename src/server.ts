import { defineServer } from 'ubean/server';
import { serverEnv } from '@/env.server';

/**
 * 服务端入口（ubean 约定：`src/server.ts`）。
 *
 * 只做进程级配置与钩子；业务逻辑放 `src/routes/**`（API）、
 * `src/middleware/**`（中间件）、`src/services/**`、`src/db/**`。
 *
 * 注：`hooks` / `globalHooks` 是 Hono 级别的钩子；启动日志走标准输出
 * （ubean CLI 在 dev 下自带请求/生命周期日志，见 `ubean.config.ts` 的 `logging`）。
 */
export default defineServer({
  hooks: {},
  onServerReady: async () => {
    console.log(`[soybean-admin] server ready at ${serverEnv.SERVER_HOST}:${serverEnv.SERVER_PORT}`);
  }
});
