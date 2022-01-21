import type { App } from 'vue';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { transformAuthRoutesToVueRoutes } from '@/utils';
import { constantRoutes } from './routes';
import { scrollBehavior } from './helpers';
import { createRouterGuard } from './guard';

const createHistoryFunc = import.meta.env.VITE_IS_VERCEL === '1' ? createWebHashHistory : createWebHistory;

export const router = createRouter({
  history: createHistoryFunc(import.meta.env.BASE_URL),
  routes: transformAuthRoutesToVueRoutes(constantRoutes),
  scrollBehavior
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}

export * from './routes';
