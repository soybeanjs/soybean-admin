import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { routes } from './routes';
import createRouterGuide from './permission';

/** 用于部署vercel托管服务 */
const isVercel = import.meta.env.VITE_HTTP_ENV === 'VERCEL';

export const router = createRouter({
  history: isVercel ? createWebHashHistory() : createWebHistory(),
  routes
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuide(router);
  await router.isReady();
}
