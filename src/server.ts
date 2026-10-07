import { defineServer } from 'ubean/server';
import { errorMiddleware } from '@/middleware/03.error';
import { runAppMigrations } from '@/db/migrations';
import { runSeed } from '@/db/seed';
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
    // 迁移 + seed 幂等（账本去重 / INSERT OR IGNORE），每次启动都执行：
    // 全新环境（CI、新克隆）的文件库从零建表灌数据；已有环境空跑无事。
    // 不在这里做的话，`.data/dev.sqlite3` 不入库（gitignored），新环境起服
    // 务必然「no such table: user」—— 集成测试与首次登录全挂。
    await runAppMigrations();
    await runSeed();

    console.log(`[soybean-admin] server ready at ${serverEnv.SERVER_HOST}:${serverEnv.SERVER_PORT}`);
  }
});
