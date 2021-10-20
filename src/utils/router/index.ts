import type { Component } from 'vue';
import { EnumRoutePath } from '@/enum';
import type { RoutePathKey } from '@/interface';
import { router } from '@/router';

/** 获取路由name map */
export function getRouteNameMap() {
  return new Map<RoutePathKey, RoutePathKey>((Object.keys(EnumRoutePath) as RoutePathKey[]).map(v => [v, v]));
}

/** 给需要缓存的页面组件设置名称 */
export function setRouterCacheName(component: Component, name?: string) {
  if (name) {
    Object.assign(component, { name });
  }
}

// 获取登录后的重定向地址
export function getLoginRedirectUrl() {
  const path = router.currentRoute.value.fullPath as EnumRoutePath;
  const redirectUrl = path === EnumRoutePath.root ? undefined : path;
  return redirectUrl;
}
