import type { AutoRouterRedirect, AutoRouterRoute, AutoRouterSingleView } from '@elegant-router/types';
import { layouts, views } from '../_generated/imports';
import { transformToVueRoutes } from '../_generated/transformer';
import { routes } from '../_generated/routes';

/**
 * 根路由
 */
export const ROOT_ROUTE: AutoRouterRedirect = {
  name: 'Root',
  path: '/',
  redirect: import.meta.env.VITE_ROUTE_HOME_PATH || '/home',
  meta: {
    title: 'Root',
    constant: true
  }
};

/**
 * 404 路由
 */
export const NOT_FOUND_ROUTE: AutoRouterSingleView = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  component: '404',
  layout: 'blank',
  meta: {
    title: 'NotFound',
    constant: true
  }
};

/** 内置路由，必须是常量路由，且必须在 vue-router 中设置 */
const builtinRoutes: AutoRouterRoute[] = [ROOT_ROUTE, NOT_FOUND_ROUTE, ...routes];

/** 创建内置 vue 路由 */
export function createBuiltinVueRoutes() {
  return transformToVueRoutes(builtinRoutes, layouts, views);
}
