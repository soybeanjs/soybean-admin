import type { Component } from 'vue';
import { EnumRoutePath } from '@/enum';
import type { RoutePathKey } from '@/interface';

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
