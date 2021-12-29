import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { routes } from '../routes';
import { createRouterGuide } from '../guard';

/** 用于部署vercel托管服务 */
const isStaging = import.meta.env.VITE_HTTP_ENV === 'STAGING';

export const router = createRouter({
  history: isStaging ? createWebHashHistory() : createWebHistory(),
  routes
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuide(router);
  await router.isReady();
}

export { default as cacheRoutes } from './cache';
export { menusList, menus } from './menus';
