import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { getCacheRoutes, transformRouteToMenu } from '@/utils';
import { routes, customRoutes } from '../routes';
import { createRouterGuide } from '../guide';

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

/** 缓存的路由对应vue页面的名称 */
export const cacheRoutes = getCacheRoutes(routes);

/** 菜单 */
export const menus = transformRouteToMenu(customRoutes);
