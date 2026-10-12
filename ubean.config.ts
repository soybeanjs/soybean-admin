import { loadEnv } from 'vite-plus';
import { defineConfig } from 'ubean';
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
  srcDir: 'src',
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
