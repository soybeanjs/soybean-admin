import type { App } from 'vue';
import { createPinia } from 'pinia';

/** setup vue store plugin: pinia. - [安装vue状态管理插件：pinia] */
export function setupStore(app: App) {
  const store = createPinia();
  app.use(store);
}

export * from './modules';
export * from './subscribe';
