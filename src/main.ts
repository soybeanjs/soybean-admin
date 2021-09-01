import { createApp } from 'vue';
import App from './App.vue';
import AppProvider from './AppProvider.vue';
import { setupStore } from './store';
import { router, setupRouter } from './router';
import { setupSmoothScroll, setupWindicssDarkMode } from './plugins';
import 'virtual:windi.css';
import './styles/css/global.css';

async function setupApp() {
  const appProvider = createApp(AppProvider);
  const app = createApp(App);

  // 挂载全局状态
  setupStore(app);

  // 优先挂载一下 appProvider 解决路由守卫，Axios中可使用，LoadingBar，Dialog，Message 等之类组件
  appProvider.mount('#appProvider', true);

  // 挂载路由
  setupRouter(app);

  // 路由准备就绪后挂载APP实例
  await router.isReady();

  app.mount('#app', true);

  setupWindicssDarkMode();
}

setupSmoothScroll();
setupApp();
