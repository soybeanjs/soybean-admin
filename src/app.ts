import type { App } from 'vue';
import { defineApp } from 'ubean/client';
import { createThemeInitScript } from '@vean/theme/ssr';
import 'uno.css';
import '@vean/ui/styles.css';
import { APP_DESCRIPTION, APP_ROOT_ID, APP_TITLE, DEFAULT_LOCALE } from '@/constants';
import { seedPresetState } from '@/shared/theme-preset';
import { registerVeanLocales } from '@/shared/vean-locale';
import { setupAuthDirectives } from '@/directives/auth';
import { readStoredThemeSettings, resolvePresetThemeState } from '@/store/modules/theme';
import { setupStore } from '@/store/setup';
import { createRouterGuard } from '@/router';
import '@/styles/index.css';

/** 注册 Vean 组件内置文案的 locale key（详见 `@/shared/vean-locale`）。 */
registerVeanLocales();

/** 写入首屏主题信封（P2-10） 详见 docs/v3-notes.md N-002。 */
seedPresetState(resolvePresetThemeState(readStoredThemeSettings()));

/** - 应用根组件走 `src/app.vue` 文件约定（`appRoot` 优先级：） 详见 docs/v3-notes.md N-003。 */
export default defineApp({
  head: {
    title: APP_TITLE,
    meta: [
      { name: 'description', content: APP_DESCRIPTION },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    htmlAttrs: { lang: DEFAULT_LOCALE },
    script: [{ id: 'vean-theme-init', textContent: createThemeInitScript() }]
  },
  rootId: APP_ROOT_ID,
  plugins: [setupStore],
  router: {
    setup: createRouterGuard
  },
  onAppCreated(app: App) {
    // 自定义指令（v-auth 权限指令，详见 @/directives/auth）。
    // defineApp 没有 setup 钩子，指令注册走 onAppCreated（app 创建后、挂载前）。
    setupAuthDirectives(app);
  }
});
