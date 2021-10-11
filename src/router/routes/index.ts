import type { RouteRecordRaw } from 'vue-router';
import ROUTE_HOME from './routeHome';
import customRoutes from '../modules';
import constantRoutes from './constant';

/** 所有路由 */
export const routes: RouteRecordRaw[] = [...customRoutes, ...constantRoutes];

export { ROUTE_HOME, customRoutes };
