import { createApp } from 'vue';
import { setupAssets, setupNaiveUI } from '@/plugins';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import { setupDirectives } from '@/directives';
import App from './App.vue';

async function setupApp() {
  // 引入静态资源
  setupAssets();

  const app = createApp(App);

  // 挂载pinia状态
  setupStore(app);

  // 挂载自定义vue指令
  setupDirectives(app);

  // 按需引入naiveUI
  setupNaiveUI(app);

  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载 App
  app.mount('#app');
}

setupApp();
