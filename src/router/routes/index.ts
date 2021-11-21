import type { RouteRecordRaw } from 'vue-router';
import customRoutes from '../modules';
import constantRoutes from './constant-routes';

/** 所有路由 */
export const routes: RouteRecordRaw[] = [...customRoutes, ...constantRoutes];

export { ROUTE_HOME } from './route-home';
