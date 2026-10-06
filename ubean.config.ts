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
   * UnoCSS 模式：只注册 UiResolver（组件自动导入），样式交由 `uno.config.ts`
   * 里的 `@vean/unocss` preset 统一管理（见 §3.1 styles/）。
   * `ui: true` 会额外注入预构建的 `@vean/ui/styles.css`，与 UnoCSS 重复，故关闭。
   */
  ui: {
    css: false
  },
  colorMode: false,
  icon: true,
  pinia: true,
  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', language: 'zh-CN', name: '简体中文', dir: 'ltr' },
      { code: 'en-US', language: 'en-US', name: 'English', dir: 'ltr' }
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
