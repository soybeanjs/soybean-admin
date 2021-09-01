import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { customRoutes } from './routes';
import createRouterGuide from './permission';

const routes: Array<RouteRecordRaw> = [...customRoutes];

const isVercel = import.meta.env.VITE_HTTP_ENV === 'VERCEL';

export const router = createRouter({
  history: isVercel ? createWebHashHistory() : createWebHistory(),
  routes
});

export function setupRouter(app: App) {
  app.use(router);
  createRouterGuide(router);
}
