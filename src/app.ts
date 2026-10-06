import { defineApp } from 'ubean/client';
import { createPinia } from 'pinia';
import 'uno.css';
import '@vean/ui/styles.css';
import { APP_DESCRIPTION, APP_ROOT_ID, APP_TITLE, DEFAULT_LOCALE } from '@/constants';
import { registerVeanLocales } from '@/shared/vean-locale';
import { setupRouterGuard } from '@/router';
import '@/styles/index.css';

/**
 * 注册 Vean 组件内置文案的 locale key（详见 `@/shared/vean-locale`）。
 *
 * 必须在 `SConfigProvider` 解析 locale **之前**执行：Vean 出厂的 key 只有
 * `en` 与 `zh-CN`，且未知 key 会静默回落到 `en` —— 不注册的话，`zh` 下分页、
 * 表格空态、标签页等组件内部文案会全部变英文（不报错）。
 */
registerVeanLocales();

/**
 * 应用入口（ubean 约定：`src/app.ts`）。
 *
 * - `plugins`：Pinia 实例。`ubean.config.ts` 的 `pinia: true` 只做 Vite
 *   预构建优化；SSR 状态水合需另配 `serializeState` / `hydrateState`
 *   （Phase 0 `ssr: false`，暂不需要）。
 * - `router.setup`：注册全局守卫（进度条 + 标题）。
 * - 应用根组件走 `src/app.vue` 文件约定（`appRoot` 优先级：
 *   `defineApp({ appRoot })` > `src/app.vue` > `src/App.vue`），
 *   出口是该组件的默认插槽 —— **不要**在这里渲染 `<PageView />`。
 *
 * ## 两个样式导入为什么都是显式的
 *
 * `import 'uno.css'` —— UnoCSS 原子类**必须**在客户端入口显式引入；
 * ubean 不注入它。漏掉会「dev 看着正常、build 产物 CSS 只剩几行」。
 *
 * `import '@vean/ui/styles.css'` —— 组件库的预构建样式（含 `bg-popover` /
 * `z-base` / `data-vean-*` 等内部规则，~198 kB）。`ubean.config.ts` 的
 * `ui: true` 本意是通过 module registry 注入它，但该注入**只在 dev 生效**：
 * `ubean dev` 在 `resolveModules()`（注册 `registerCssImport`）之后才解析虚拟
 * 入口，而构建路径 `prepareBuild()` 先在 `generateVirtualModulesToDisk()`
 * 里把 `client-entry.mjs` **写盘**、再调 `resolveModules()` —— 落盘的入口里
 * 因此没有这条 css import（实测 `ubean build` 与 `vp build` 同病：去掉显式
 * import 后产物 CSS 从 205.8 kB 掉到 4.2 kB，组件样式全丢）。
 * 显式 import 与 registry 注入解析到同一个模块说明符，Vite 会去重，
 * 两条路径同时存在不会重复。
 */
export default defineApp({
  head: {
    title: APP_TITLE,
    meta: [
      { name: 'description', content: APP_DESCRIPTION },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    htmlAttrs: { lang: DEFAULT_LOCALE }
  },
  rootId: APP_ROOT_ID,
  plugins: [createPinia()],
  router: {
    setup: setupRouterGuard
  }
});
