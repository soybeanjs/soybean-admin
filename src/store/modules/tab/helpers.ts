import type { RouteRecordNormalized, RouteLocationNormalizedLoaded } from 'vue-router';
import type { GlobalTabRoute } from '@/interface';

/**
 *	根据vue路由获取tab路由
 * @param route
 */
export function getTabRouteByVueRoute(route: RouteRecordNormalized | RouteLocationNormalizedLoaded) {
  const tabRoute: GlobalTabRoute = {
    name: route.name,
    path: route.path,
    meta: route.meta,
    scrollPosition: {
      left: 0,
      top: 0
    }
  };
  return tabRoute;
}

/**
 * 获取该页签在多页签数据中的索引
 * @param tabs - 多页签数据
 * @param path - 该页签的路径
 */
export function getIndexInTabRoutes(tabs: GlobalTabRoute[], path: string) {
  return tabs.findIndex(tab => tab.path === path);
}

/**
 * 判断该页签是否在多页签数据中
 * @param tabs - 多页签数据
 * @param path - 该页签的路径
 */
export function isInTabRoutes(tabs: GlobalTabRoute[], path: string) {
  return getIndexInTabRoutes(tabs, path) > -1;
}
