import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { ROUTE_HOME } from '@/router';
import { brightenColor, darkenColor } from '@/utils';
import type { MultiTabRoute } from '@/interface';

export function getHoverAndPressedColor(color: string) {
  return {
    hover: brightenColor(color),
    pressed: darkenColor(color)
  };
}

/** 获取路由首页信息 */
export function getHomeTabRoute(route: RouteLocationNormalizedLoaded) {
  const { name, path, meta } = ROUTE_HOME;
  const isHome = route.name === ROUTE_HOME.name;
  const home: MultiTabRoute = {
    name,
    path,
    fullPath: path,
    meta
  };
  if (isHome) {
    Object.assign(home, route);
  }
  return home;
}

/**
 * 获取该页签在多页签数据中的索引
 * @param routes - 多页签数据
 * @param fullPath - 该页签的路径
 */
export function getIndexInTabRoutes(routes: MultiTabRoute[], fullPath: string) {
  return routes.findIndex(route => route.fullPath === fullPath);
}

/**
 * 判断该页签是否在多页签数据中
 * @param routes - 多页签数据
 * @param fullPath - 该页签的路径
 */
export function isInTabRoutes(routes: MultiTabRoute[], fullPath: string) {
  return getIndexInTabRoutes(routes, fullPath) > -1;
}
