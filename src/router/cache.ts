import type { RouteRecordRaw } from 'vue-router';
import { routes } from './routes';

function getCacheRoutes() {
  const cacheNames: string[] = [];
  routes.forEach(route => {
    const isCache = isKeepAlive(route);
    cacheNames.push(...getCacheName(route, isCache));
  });
  return cacheNames;
}

function getCacheName(route: RouteRecordRaw, isCache: boolean) {
  const cacheNames: string[] = [];
  const hasChild = hasChildren(route);
  if (isCache && !hasChild) {
    const name = route.name as string;
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

/** 被缓存的路由 */
export const cacheRoutes = getCacheRoutes();
