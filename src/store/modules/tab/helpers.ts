import type { RouteLocationNormalizedLoaded, RouteRecordNormalized } from 'vue-router';
import { localStg } from '@/utils';

/**
 * 根据vue路由获取tab路由
 * @param route
 */
export function getTabRouteByVueRoute(route: RouteRecordNormalized | RouteLocationNormalizedLoaded) {
  const fullPath = hasFullPath(route) ? route.fullPath : route.path;

  const tabRoute: App.GlobalTabRoute = {
    name: route.name,
    fullPath,
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
 * @param fullPath - 该页签的路径
 */
export function getIndexInTabRoutes(tabs: App.GlobalTabRoute[], fullPath: string) {
  return tabs.findIndex(tab => tab.fullPath === fullPath);
}

/**
 * 判断该页签是否在多页签数据中
 * @param tabs - 多页签数据
 * @param fullPath - 该页签的路径
 */
export function isInTabRoutes(tabs: App.GlobalTabRoute[], fullPath: string) {
  return getIndexInTabRoutes(tabs, fullPath) > -1;
}

/**
 * 根据路由名称获取该页签在多页签数据中的索引
 * @param tabs - 多页签数据
 * @param routeName - 路由名称
 */
export function getIndexInTabRoutesByRouteName(tabs: App.GlobalTabRoute[], routeName: string) {
  return tabs.findIndex(tab => tab.name === routeName);
}

/**
 * 判断路由是否有fullPath属性
 * @param route 路由
 */
function hasFullPath(
  route: RouteRecordNormalized | RouteLocationNormalizedLoaded
): route is RouteLocationNormalizedLoaded {
  return Boolean((route as RouteLocationNormalizedLoaded).fullPath);
}

/** 获取缓存的多页签数据 */
export function getTabRoutes() {
  const routes: App.GlobalTabRoute[] = [];
  const data = localStg.get('multiTabRoutes');
  if (data) {
    const defaultTabRoutes = data.map(item => ({
      ...item,
      scrollPosition: {
        left: 0,
        top: 0
      }
    }));
    routes.push(...defaultTabRoutes);
  }
  return routes;
}

/** 清空多页签数据 */
export function clearTabRoutes() {
  localStg.set('multiTabRoutes', []);
}
