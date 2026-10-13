import { defineServer } from 'ubean/server';
import { createUbeanLogger } from '@ubean/shared/logger';
import { createRequestLoggerMiddleware } from '@ubean/shared/logger/hono';
import { diffApiRoutes, formatApiRouteDiff } from '@/shared/api-route-sync';
import type { RegisteredRoute } from '@/shared/api-route-sync';
import { errorMiddleware } from '@/middleware/03.error';
import { apiService } from '@/services/api-org.service';
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
 * 注：`hooks` / `globalHooks` 是 Hono 级别的钩子。
 *
 * 路由对账（§5.2-5）：`route:register` 钩子收集本次启动真实注册的全部 API 路由，
 * `onServerReady` 里（迁移 + seed 之后）与 `api` 表比对，缺失/幽灵行打 warning。
 * 只警告不写库 —— 漏登记的代价是多一条日志，自动写库的代价是 id/审计/幂等键
 * 全都得在启动期正确处理，得不偿失。
 *
 * 请求日志（P2-18）：ubean CLI 自带的是生命周期日志，这里额外挂
 * `createRequestLoggerMiddleware` 拿到**方法 / 路径 / 状态码 / 耗时**。
 * logger 用 tslog pretty 输出：等级按级别着色，交互式终端上色、被管道重定向
 * 时自动去色（也遵守 `NO_COLOR`），所以本地彩色、CI 纯文本两不误。
 */
const requestLogger = createUbeanLogger({
  name: 'api',
  minLevel: 'INFO',
  pretty: {
    template: '{{hh}}:{{MM}}:{{ss}} {{logLevelName}} {{name}} ',
    timeZone: 'local'
  }
});

/** 本次启动注册的路由（`route:register` 钩子填充，`onServerReady` 里对账） */
const registeredApiRoutes: RegisteredRoute[] = [];

export default defineServer({
  hooks: {
    'route:register': route => {
      const method = route.method.toLowerCase();

      // 只收业务 API（`/api/**`）；页面路由与静态资源不参与权限对账
      if (method === 'all' || !route.path.startsWith('/api/')) return;

      registeredApiRoutes.push({ method, path: route.path });
    }
  },
  plugins: [
    {
      name: 'api-request-logger',
      setup: app => {
        app.hono.use(
          '*',
          createRequestLoggerMiddleware({
            logger: requestLogger,
            // 静态资源 / devtools / 代理自身会刷屏；业务 API 与代理流量全记
            exclude: [
              '/_assets/**',
              '/_devtools/**',
              '/favicon.ico',
              '/@fs/**',
              '/@id/**',
              '/@vite/**',
              '/node_modules/**'
            ],
            slowThreshold: 1000
          })
        );
      }
    },
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

    // seed 之后才能对账（否则全新库的 api 表还是空的，会把全部路由报成 missing）
    const diff = diffApiRoutes(registeredApiRoutes, apiService.getAllApis());
    const lines = formatApiRouteDiff(diff);

    if (lines.length) {
      lines.forEach(line => console.warn(line));
    }

    console.log(`[soybean-admin] server ready at ${serverEnv.SERVER_HOST}:${serverEnv.SERVER_PORT}`);
  }
});
