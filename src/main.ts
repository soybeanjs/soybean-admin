/*
 * @Author: whr2349 378237242@QQ.com
 * @Date: 2023-08-17 09:25:28
 * @LastEditors: whr2349 378237242@QQ.com
 * @LastEditTime: 2023-08-17 14:11:06
 * @FilePath: \soybean-admin\src\main.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { createApp } from 'vue';
import App from './App.vue';
import AppLoading from './components/common/app-loading.vue';
import { setupDirectives } from './directives';
import { setupRouter } from './router';
import { setupAssets } from './plugins';
import { setupStore } from './store';
import { setupI18n } from './locales';

async function setupApp() {
  // import assets: js、css
  setupAssets();

  // app loading
  const appLoading = createApp(AppLoading);

  appLoading.mount('#appLoading');

  // app
  const app = createApp(App);

  // store plugin: pinia
  setupStore(app);

  // vue custom directives
  setupDirectives(app);

  // vue router
  await setupRouter(app);

  setupI18n(app);

  appLoading.unmount();

  // mount app
  app.mount('#app');
}

setupApp();
