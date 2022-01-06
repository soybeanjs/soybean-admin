import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { transformAuthRoutesToVueRoutes } from '@/utils';
import { constantRoutes } from './routes';
import { createRouterGuide } from './guard';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: transformAuthRoutesToVueRoutes(constantRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuide(router);
  await router.isReady();
}

export * from './routes';
