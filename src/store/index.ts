import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

/** setup vue store plugin: pinia. - [安装vue状态管理插件：pinia] */
export function setupStore(app: App) {
  const store = createPinia();
  store.use(resetSetupStore);

  app.use(store);
}

export * from './modules';
export * from './subscribe';
