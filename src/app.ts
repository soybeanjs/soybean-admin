import { defineApp } from 'ubean/client';
import { createPinia } from 'pinia';
import 'uno.css';
import { APP_DESCRIPTION, APP_ROOT_ID, APP_TITLE } from '@/constants';
import { setupRouterGuard } from '@/router';
import '@/styles/index.css';

/**
 * 应用入口（ubean 约定：`src/app.ts`）。
 *
 * - `plugins`：Pinia 实例。`ubean.config.ts` 的 `pinia: true` 只做 Vite
 *   预构建优化；SSR 状态水合需另配 `serializeState` / `hydrateState`
 *   （Phase 0 `ssr: false`，暂不需要）。
 * - `router.setup`：注册全局守卫（进度条 + 标题）。
 * - `import 'uno.css'`：UnoCSS 的原⼦类**必须**在客户端入口显式引入（ubean
 *   不会自动注入）。漏掉它会出现「dev 看着正常、build 产物 CSS 只剩几行」
 *   的现象 —— 所有 `presetUi` 工具类都不会被打包。
 * - 应用根组件走 `src/app.vue` 文件约定（`appRoot` 优先级：
 *   `defineApp({ appRoot })` > `src/app.vue` > `src/App.vue`），
 *   出口是该组件的默认插槽 —— **不要**在这里渲染 `<PageView />`。
 */
export default defineApp({
  head: {
    title: APP_TITLE,
    meta: [
      { name: 'description', content: APP_DESCRIPTION },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    htmlAttrs: { lang: 'zh-CN' }
  },
  rootId: APP_ROOT_ID,
  plugins: [createPinia()],
  router: {
    setup: setupRouterGuard
  }
});
