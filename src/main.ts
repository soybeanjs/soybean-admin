import { createApp } from 'vue';
import { setupAssets } from '@/plugins';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import App from './App.vue';

async function setupApp() {
  const app = createApp(App);

  // 挂载全局状态
  setupStore(app);

  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载APP实例
  app.mount('#app');
}

setupAssets();

setupApp();
