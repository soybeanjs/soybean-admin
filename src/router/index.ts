import type { App } from 'vue';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { transformAuthRoutesToVueRoutes } from '@/utils';
import { constantRoutes } from './routes';
import { scrollBehavior } from './helpers';
import { createRouterGuard } from './guard';

const { VITE_HASH_ROUTE = 'false', VITE_BASE_URL } = import.meta.env;
const history = VITE_HASH_ROUTE === 'true' ? createWebHashHistory(VITE_BASE_URL) : createWebHistory(VITE_BASE_URL);

export const router = createRouter({
  history,
  routes: transformAuthRoutesToVueRoutes(constantRoutes),
  scrollBehavior
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}

export * from './routes';
