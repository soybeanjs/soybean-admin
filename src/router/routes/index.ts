import type { RouteRecordRaw } from 'vue-router';
import { transformMultiDegreeRoutes } from '@/utils';
import customRoutes from '../modules';
import constantRoutes from './constant-routes';

const transformRoutes = transformMultiDegreeRoutes(customRoutes);

/** 所有路由 */
export const routes: RouteRecordRaw[] = [...transformRoutes, ...constantRoutes];

export { ROUTE_HOME } from './route-home';
