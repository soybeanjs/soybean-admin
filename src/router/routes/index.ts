import type { RouteRecordRaw } from 'vue-router';
import { transformAuthRoutesToVueRoutes } from '@/utils';
import constantRoutes from './constant';

/** 所有路由 */
export const routes: RouteRecordRaw[] = transformAuthRoutesToVueRoutes(constantRoutes);

/** 路由名称 */
export const routeName = (key: AuthRoute.RouteKey) => key;

/** 路由路径 */
export function routePath(key: Exclude<AuthRoute.RouteKey, 'not-found-page'>): AuthRoute.RoutePath {
  const rootPath: AuthRoute.RoutePath = '/';
  if (key === 'root') return rootPath;
  const splitMark: AuthRoute.RouteSplitMark = '_';
  const pathSplitMark = '/';
  const path = key.split(splitMark).join(pathSplitMark);
  return (pathSplitMark + path) as AuthRoute.RoutePath;
}

export { constantRoutes };
