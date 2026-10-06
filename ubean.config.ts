import { defineConfig } from 'ubean';

export default defineConfig({
  srcDir: 'src',
  build: {
    preset: 'standard'
  },
  mode: 'fullstack',
  /**
   * Phase 0 采用 SPA 骨架先行（P0-03）：
   * 页面路由 / 守卫 / API 路由 / typed client 全部跑通，但暂不做服务端渲染。
   * 后续 Phase 视需要切回 `ssr: true`（或按路由 `ssr: 'streaming'`）。
   */
  ssr: false,
  /**
   * UI 集成：注册 UiResolver（组件自动导入）。
   *
   * `css` 保持默认 `true`：dev 下由 module registry 把 `@vean/ui/styles.css`
   * 注入虚拟客户端入口。**但构建路径不会带上它**（`prepareBuild()` 先写盘
   * `client-entry.mjs` 再 `resolveModules()`，见 `src/app.ts` 的说明），
   * 所以应用侧仍有显式 `import '@vean/ui/styles.css'` 作为唯一可靠来源；
   * 两者解析同一模块说明符，Vite 会去重。
   */
  ui: true,
  colorMode: false,
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
  routing: {
    // v2 使用 elegant-router 生成 src/router/elegant；v3 用 ubean 文件式路由 + 生成物
    outputDir: 'src/router/_generated',
    defaultLayout: 'default',
    notFoundRouteComponent: '404.vue'
  },
  dev: {
    port: 9527
  },
  devtools: true
});
