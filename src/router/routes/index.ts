import type { RouteRecordRaw } from 'vue-router';
import { transformAuthRouteToVueRoute } from '@/utils';
import constantRoutes from './constant';

/** 所有路由 */
export const routes: RouteRecordRaw[] = constantRoutes.map(item => transformAuthRouteToVueRoute(item));

export { constantRoutes };
