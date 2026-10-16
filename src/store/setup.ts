import type { App } from 'vue';
import { createPinia } from 'pinia';
import type { Pinia } from 'pinia';
import { resetSetupStore } from './plugin';

/**
 * Pinia 装配（v3 §5.1）：先把 `resetSetupStore` 挂上去再 `app.use`，
 * 否则插件不会对后续 `defineStore` 生效（`use()` 在 `install(app)` 之前只是入队）。
 *
 * `defineApp({ plugins: [setupStore] })` 直接当 Vue 插件调用（`plugins` 接受 `Plugin`）。
 * 返回实例只为单测能 `setActivePinia` —— 生产链路不需要它。
 */
export function setupStore(app: App): Pinia {
  const store = createPinia();

  store.use(resetSetupStore);
  app.use(store);

  return store;
}
