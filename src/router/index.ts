import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { constantRoutes, customRoutes, RouteNameMap } from './routes';
import createRouterGuide from './permission';

const routes: Array<RouteRecordRaw> = [...customRoutes, ...constantRoutes];

/** 用于部署vercel托管服务 */
const isVercel = import.meta.env.VITE_HTTP_ENV === 'VERCEL';

const router = createRouter({
  history: isVercel ? createWebHashHistory() : createWebHistory(),
  routes
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuide(router);
  await router.isReady();
}

export { RouteNameMap };
export { menus } from './menus';
