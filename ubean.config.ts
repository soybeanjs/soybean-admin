import { loadEnv } from 'vite-plus';
import { defineConfig, envField } from 'ubean';
import { buildPluginSsrRouteRules, buildProxyRouteRules, parseApiProxyTargets } from './src/shared/api-proxy';

/**
 * 多 baseURL 代理（P2-18）：`API_PROXY_TARGETS`（server 变量，`.env`）里的每个
 * `key=origin` 生成一条 `/_p/{key}/**` → `{origin}/**` 的 routeRule。
 *
 * config 是同步求值的（`defineConfig(config?: UbeanConfig): UbeanConfig` 不支持
 * async），所以用 vite-plus 同步导出的 `loadEnv` 读 `.env`；解析逻辑放在纯函数
 * `src/shared/api-proxy.ts`，与客户端（只拿 key）、测试三方共用。
 */
const apiProxyTargets = parseApiProxyTargets(
  loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '').API_PROXY_TARGETS ?? ''
);

export default defineConfig({
  /**
   * 环境变量 schema（P0-D）：唯一真相源，`.env` 的每个 key 都在这里声明一次。
   *
   * 声明的收益（对照迁移前的三处手写：`src/env.ts` + `src/env.server.ts` +
   * `src/typings/env.d.ts`）：
   * - codegen 生成 `.ubean/env.d.ts` 的 `ubean:env/client` / `ubean:env/server` 类型，
   *   不再有「`.env` 加了 key 忘了加到 env.d.ts」这类漂移（迁移前 `VITE_API_PROXY_KEYS`
   *   就是这样漏掉的）。
   * - `ubean:env/client` 直接读 `.env` 原文，**不需要 `VITE_` 前缀**。
   * - server 字段被客户端代码 import 时构建直接失败，而不是静默退回 default。
   *
   * 三条不变式：
   * 1. client 字段一律带 `default`（值被内联进客户端产物；漏装 `default` 会让生成的
   *    `export const X: string = undefined` 变成类型谎言）。
   * 2. 除 `SERVER_PORT`（number）与 `AUTH_ROUTE_MODE`（enum）外一律 string —— `.env`
   *    里的值本来就是字符串。
   * 3. `API_PROXY_TARGETS` 虽在 `src/` 里零消费，仍必须声明：上面那行 `parseApiProxyTargets()`
   *    要在**配置求值期**读它，而 `env` 插件直到 `configResolved` 才把 `.env` 合进
   *    `process.env`，所以那行自己 `loadEnv()`，不读 `ubean:env/server`。
   */
  env: {
    mode: 'throw',
    schema: {
      // ---- 应用元信息 ----
      APP_TITLE: envField.string({ context: 'client', access: 'public', default: 'SoybeanAdmin' }),
      APP_DESCRIPTION: envField.string({ context: 'client', access: 'public', default: '' }),

      // ---- API / 代理 ----
      API_BASE_URL: envField.string({ context: 'client', access: 'public', default: '' }),
      API_PROXY: envField.string({ context: 'client', access: 'public', default: '' }),
      API_PREFIX: envField.string({ context: 'client', access: 'public', default: '/api' }),
      API_ENV: envField.string({ context: 'client', access: 'public', default: 'local' }),
      API_PROXY_KEYS: envField.string({ context: 'client', access: 'public', default: '' }),

      // ---- 主题 / 布局 ----
      THEME_PRESET: envField.string({ context: 'client', access: 'public', default: 'default' }),
      // 不在 `.env` 里，只靠 default —— 与迁移前 `src/env.ts` 的 `|| 'vertical'` 等价。
      LAYOUT_MODE: envField.string({ context: 'client', access: 'public', default: 'vertical' }),

      // ---- 路由 / 菜单 ----
      AUTH_ROUTE_MODE: envField.enum({
        context: 'client',
        access: 'public',
        values: ['static', 'dynamic'],
        default: 'static'
      }),
      ROUTE_HOME: envField.string({ context: 'client', access: 'public', default: '/' }),

      // ---- 请求层业务码 ----
      SERVICE_SUCCESS_CODE: envField.string({ context: 'client', access: 'public', default: '0000' }),
      // 迁移前 `src/env.ts` 里这四个默认值是 `''`（`.env` 恒有值，走不到回退分支）；
      // 这里保留 `''` 以忠实于既有运行期语义。
      SERVICE_LOGOUT_CODES: envField.string({ context: 'client', access: 'public', default: '' }),
      SERVICE_MODAL_LOGOUT_CODES: envField.string({ context: 'client', access: 'public', default: '' }),
      SERVICE_EXPIRED_TOKEN_CODES: envField.string({ context: 'client', access: 'public', default: '2001' }),
      STATIC_SUPER_ROLE: envField.string({ context: 'client', access: 'public', default: 'super' }),
      STORAGE_PREFIX: envField.string({ context: 'client', access: 'public', default: '@soybean/' }),

      // ---- 服务端 ----
      SERVER_HOST: envField.string({ context: 'server', access: 'secret', default: '0.0.0.0' }),
      SERVER_PORT: envField.number({ context: 'server', access: 'secret', default: 9527 }),
      // 零消费（seed / cron / server action 直调自身时才需要），保留以保证 `.env` 自描述。
      SERVER_INTERNAL_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://127.0.0.1:9527'
      }),
      API_PROXY_TARGETS: envField.string({ context: 'server', access: 'secret', default: '' }),

      // ---- 鉴权 ----
      JWT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        default: 'soybean-admin-v3-dev-secret-change-me'
      }),
      JWT_EXPIRES_IN: envField.string({ context: 'server', access: 'secret', default: '1d' }),
      REFRESH_TOKEN_EXPIRES_IN: envField.string({ context: 'server', access: 'secret', default: '7d' }),

      // ---- 数据库 / 缓存 ----
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', default: '' }),
      REDIS_URL: envField.string({ context: 'server', access: 'secret', default: '' })
    }
  },
  favicon: 'https://img.soybeanjs.dev/logo-soybean-admin.svg',
  build: {
    preset: 'standard'
  },
  mode: 'fullstack',
  ssr: false,
  ui: true,
  icon: true,
  pinia: true,
  i18n: {
    defaultLocale: 'zh',
    locales: [
      { code: 'zh', language: 'zh-CN', name: '简体中文', dir: 'ltr' },
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr' }
    ],
    strategy: 'prefix_except_default'
  },
  /**
   * `modules/` 是页面私有子组件目录，不是页面。
   *
   * 不能删：ubean 扫描器只硬编码忽略 `components/**` 与 `_*`，`modules/` 会被
   * 当成页面扫出 `/login/modules/pwd-login` 这类垃圾路由 —— 实测 92 条真实页面
   * 被放大成 183 条路由，登录模块的 vee-validate 表单代码被拖进 entry chunk
   * （`analyze:check` 的 entry gzip 从 43.7 kB 涨到 46.0 kB，超 5% 预算）。
   *
   * `resolveUbeanConfig` 用 `defu` 合并，用户 ignore 追加在 `DEFAULT_IGNORE` 之后，
   * 不会覆盖默认项；这些文件本来也不需要用 `definePage`。
   */
  scanOptions: {
    ignore: ['**/modules/**']
  },
  dev: {
    port: 9527
  },
  /**
   * `/_p/{key}/**` 转发到各自上游；key 为空时不产出规则，代理整体关闭。
   * 另外把 `/plugin/**` 演示页降级为 CSR —— 那些第三方集成库在模块求值期就碰
   * 浏览器 API，Node 预渲染必炸（详见 `buildPluginSsrRouteRules` 的注释）。
   */
  routeRules: { ...buildProxyRouteRules(apiProxyTargets), ...buildPluginSsrRouteRules() },
  security: {
    headers: {
      contentSecurityPolicy: {
        'connect-src': ["'self'", 'ws:', 'wss:', 'https://api.iconify.design']
      }
    }
  },
  devtools: true
});
