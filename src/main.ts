import { createApp } from 'vue';
import './plugins/assets';
import { setupDayjs, setupIconifyOffline, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import AppLoading from './components/common/app-loading.vue';
import App from './App.vue';

async function setupApp() {
  const appLoading = createApp(AppLoading);

  appLoading.mount('#appLoading');

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  app.mount('#app');

  appLoading.unmount();
}

setupApp();
