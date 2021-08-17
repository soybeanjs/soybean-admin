import { createRouter, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { customRoutes } from './routes';
import createRouterGuide from './permission';

const routes: Array<RouteRecordRaw> = [...customRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes
});

createRouterGuide(router);

export function setupRouter(app: App) {
  app.use(router);
}
