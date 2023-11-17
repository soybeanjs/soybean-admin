import type { App } from 'vue';
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  createMemoryHistory,
  type RouterHistory
} from 'vue-router';
import { createRoutes } from './routes';
import { createRouterGuard } from './guard';

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env;

const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory
};

const { constantVueRoutes } = createRoutes();

export const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  routes: constantVueRoutes
});

/**
 * setup Vue Router
 */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
