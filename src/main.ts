import { createApp } from 'vue';
import { setupImportAssets } from './plugins';
import { setupStore } from './store';
import { setupDirectives } from './directives';
import { setupRouter } from './router';
import App from './App.vue';

async function setupApp() {
  setupImportAssets();

  const app = createApp(App);

  setupStore(app);

  setupDirectives(app);

  await setupRouter(app);

  app.mount('#app');
}

setupApp();
