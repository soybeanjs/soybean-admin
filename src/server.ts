import { defineServer } from 'ubean/server';
import { createUbeanLogger } from '@ubean/shared/logger';
import { createRequestLoggerMiddleware } from '@ubean/shared/logger/hono';
import {
  REDIS_URL as ENV_REDIS_URL,
  SERVER_HOST as ENV_SERVER_HOST,
  SERVER_PORT as ENV_SERVER_PORT
} from 'ubean:env/server';
import { diffApiRoutes, formatApiRouteDiff } from '@/shared/api-route-sync';
import type { RegisteredRoute } from '@/shared/api-route-sync';
import { errorMiddleware } from '@/middleware/03.error';
import { apiService } from '@/services/api-org.service';
import { runAppMigrations } from '@/db/migrations';
import { runSeed } from '@/db/seed';

/** 服务端入口（ubean 约定：`src/server.ts`） 详见 docs/v3-notes.md N-010。 */
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
    // 审计 1.5：token 黑名单 / 权限码缓存 / 图形验证码三个 KV 都走 `useKV`，而
    // `useStorage()` 目前只有内存驱动 —— 一旦起多个实例，A 实例登出写进自己的
    // 黑名单、B 实例从没见过该 key，已失效 token 会在 B 上继续有效。这里只在
    // 生产环境留空时告警（不阻断启动：单实例部署是合法前提）。
    if (process.env.NODE_ENV === 'production' && !ENV_REDIS_URL) {
      console.warn(
        '[soybean-admin] REDIS_URL 为空：登录黑名单、权限码缓存、图形验证码都会落在单进程内存里。' +
          '多实例部署必须配置外部 KV，否则登出 / 撤权不会跨实例生效。'
      );
    }

    // 迁移 + seed 幂等（账本去重 / INSERT OR IGNORE），每次启动都执行：全新环境（CI、新克隆）的文件库从零建表灌数据；已有环境空跑无事。
    // 不在这里做的话，`.data/dev.sqlite3` 不入库（gitignored），新环境起服务必然「no such table: user」—— 集成测试与首次登录全挂。
    await runAppMigrations();
    await runSeed();

    // seed 之后才能对账（否则全新库的 api 表还是空的，会把全部路由报成 missing）
    const diff = diffApiRoutes(registeredApiRoutes, apiService.getAllApis());
    const lines = formatApiRouteDiff(diff);

    if (lines.length) {
      lines.forEach(line => console.warn(line));
    }

    console.log(`[soybean-admin] server ready at ${ENV_SERVER_HOST}:${ENV_SERVER_PORT}`);
  }
});
