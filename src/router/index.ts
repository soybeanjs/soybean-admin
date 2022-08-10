import type { App } from 'vue';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { transformAuthRoutesToVueRoutes, transformRouteNameToRoutePath } from '@/utils';
import { constantRoutes } from './routes';
import { scrollBehavior } from './helpers';
import { createRouterGuard } from './guard';

const { VITE_HASH_ROUTE = 'N', VITE_BASE_URL } = import.meta.env;

export const router = createRouter({
  history: VITE_HASH_ROUTE === 'Y' ? createWebHashHistory(VITE_BASE_URL) : createWebHistory(VITE_BASE_URL),
  routes: transformAuthRoutesToVueRoutes(constantRoutes),
  scrollBehavior
});

/** setup vue router. - [安装vue路由] */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}

/** 路由名称 */
export const routeName = (key: AuthRoute.RouteKey) => key;
/** 路由路径 */
export const routePath = (key: Exclude<AuthRoute.RouteKey, 'not-found-page'>) => transformRouteNameToRoutePath(key);

export * from './routes';
export * from './modules';
