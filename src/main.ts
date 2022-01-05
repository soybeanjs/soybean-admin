import { createApp } from 'vue';
import { setupAssets, setupInitSvgLogo } from '@/plugins';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import AppProvider from './AppProvider.vue';
import App from './App.vue';

async function setupApp() {
  // 初始化加载的svg logo
  setupInitSvgLogo('#loadingLogo');

  // 引入静态资源
  setupAssets();

  // 挂载 appProvider 解决路由守卫，Axios中可使用，LoadingBar，Dialog，Message 等之类组件
  const appProvider = createApp(AppProvider);
  setupStore(appProvider);
  appProvider.mount('#appProvider');

  const app = createApp(App);
  setupStore(app);

  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载 App
  app.mount('#app');
}

setupApp();
