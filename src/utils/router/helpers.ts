import type { Component } from 'vue';
import { EnumRoutePath } from '@/enum';
import type { RoutePathKey, CustomRoute } from '@/interface';
import { router } from '@/router';

/** 获取路由name map */
function getRouteNameMap() {
  return new Map<RoutePathKey, RoutePathKey>((Object.keys(EnumRoutePath) as RoutePathKey[]).map(v => [v, v]));
}

/** 路由名称 */
export const ROUTE_NAME_MAP = getRouteNameMap();

/** 给需要缓存的页面组件设置名称 */
export function setRouterCacheName(component: Component, name?: string) {
  if (name) {
    Object.assign(component, { name });
  }
}

/** 获取登录后的重定向地址 */
export function getLoginRedirectUrl() {
  const path = router.currentRoute.value.fullPath as EnumRoutePath;
  const redirectUrl = path === EnumRoutePath.root ? undefined : path;
  return redirectUrl;
}

/**
 * 设置单个路由
 * @param route - 路由
 * @param notFoundName - 404未找到的路由名称
 * @param container - 路由容器
 */
export function setSingleRoute(container: Component, route: CustomRoute) {
  const routeItem: CustomRoute = {
    name: `${route.name as string}_`,
    path: `${route.path}_`,
    component: container,
    redirect: { name: ROUTE_NAME_MAP.get('not-found') },
    meta: {
      isNotMenu: true
    },
    children: [route]
  };

  return routeItem;
}
