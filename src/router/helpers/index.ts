import type { Component } from 'vue';
import { getRouteNameMap } from '@/utils';
import { BasicLayout, BlankLayout } from '@/layouts';
import type { CustomRoute } from '@/interface';
import getCacheRoutes from './cache';
import transformRouteToMenu from './menus';

/** 给需要缓存的页面组件设置名称 */
export function setCacheName(component: Component, name?: string) {
  if (name) {
    Object.assign(component, { name });
  }
}

/** 路由name map */
export const RouteNameMap = getRouteNameMap();

function getSingleRoute(route: CustomRoute, container: Component) {
  const routeItem: CustomRoute = {
    name: `${route.name as string}_`,
    path: `${route.path}_`,
    component: container,
    redirect: { name: route.name },
    meta: {
      isNotMenu: true
    },
    children: [route]
  };

  return routeItem;
}

export function getSingleBasicLayoutRoute(route: CustomRoute) {
  return getSingleRoute(route, BasicLayout);
}
export function getSingleBlankLayoutRoute(route: CustomRoute) {
  return getSingleRoute(route, BlankLayout);
}

export { getCacheRoutes, transformRouteToMenu };
