import type { Component } from 'vue';
import type { CustomRoute } from '@/interface';
import { router } from '@/router';

/** 给需要缓存的页面组件设置名称 */
export function setRouterCacheName(component: Component, name?: string) {
  if (name) {
    Object.assign(component, { name });
  }
}

/** 获取登录后的重定向地址 */
export function getLoginRedirectUrl() {
  const path = router.currentRoute.value.fullPath as string;
  const redirectUrl = path === '/' ? undefined : path;
  return redirectUrl;
}

/**
 * 设置单个路由
 * @param route - 路由
 * @param notFoundName - 404未找到的路由名称
 * @param container - 路由容器
 */
export function setSingleRoute(container: Component, route: CustomRoute, notFoundName = 'not-found') {
  const routeItem: CustomRoute = {
    name: `${route.name as string}_`,
    path: `${route.path}_`,
    component: container,
    redirect: { name: notFoundName },
    meta: {
      isNotMenu: true
    },
    children: [route]
  };

  return routeItem;
}
