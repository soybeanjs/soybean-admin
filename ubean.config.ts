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
