import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

/** 给需要缓存的页面组件设置名称 */
function setComponentName(component?: Component, name?: string) {
  if (component && name) {
    Object.assign(component, { name });
  }
}

function getCacheName(route: RouteRecordRaw, isCache: boolean) {
  const cacheNames: string[] = [];
  const hasChild = hasChildren(route);
  if (isCache && !hasChild) {
    const name = route.name as string;
    setComponentName(route.component, name);
    cacheNames.push(name);
  }
  if (hasChild) {
    const children = route.children as RouteRecordRaw[];
    children.forEach(item => {
      const isChildCache = isCache || isKeepAlive(item);
      cacheNames.push(...getCacheName(item, isChildCache));
    });
  }
  return cacheNames;
}

function isKeepAlive(route: RouteRecordRaw) {
  return Boolean(route?.meta?.keepAlive);
}
function hasChildren(route: RouteRecordRaw) {
  return Boolean(route.children && route.children.length);
}

/** 获取被缓存的路由 */
export function getCacheRoutes(routes: RouteRecordRaw[]) {
  const cacheNames: string[] = [];
  routes.forEach(route => {
    const isCache = isKeepAlive(route);
    cacheNames.push(...getCacheName(route, isCache));
  });
  return cacheNames;
}
