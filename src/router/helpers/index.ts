import type { Component } from 'vue';
import { getLoginModuleRegExp, getRouteNameMap } from '@/utils';
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

/** 登录模块的正则字符串 */
export const loginModuleRegExp = getLoginModuleRegExp();

export { getCacheRoutes, transformRouteToMenu };
