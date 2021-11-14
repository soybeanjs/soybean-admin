import { createApp } from 'vue';
import App from './App.vue';
import AppProvider from './AppProvider.vue';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupAssets, setupWindicssDarkMode } from './plugins';

function setupPlugins() {
  /** 引入静态资源 */
  setupAssets();
  // 配置windicss暗黑主题
  setupWindicssDarkMode();
}

async function setupApp() {
  const appProvider = createApp(AppProvider);
  const app = createApp(App);

  // 挂载全局状态
  setupStore(app);

  // 优先挂载一下 appProvider 解决路由守卫，Axios中可使用，LoadingBar，Dialog，Message 等之类组件
  appProvider.mount('#appProvider', true);

  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载APP实例
  app.mount('#app', true);
}

setupPlugins();
setupApp();
