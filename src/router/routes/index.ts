import type { AutoRouterRoute } from '@elegant-router/types';
import { routes } from '../_generated/routes';
import { layouts, views } from '../_generated/imports';
import { transformToVueRoutes } from '../_generated/transformer';

/** 创建静态路由 */
export function createStaticRoutes() {
  const constantRoutes: AutoRouterRoute[] = [];
  const authRoutes: AutoRouterRoute[] = [];

  routes.forEach(item => {
    if (item.meta?.constant) {
      constantRoutes.push(item);
    } else {
      authRoutes.push(item);
    }
  });

  return {
    constantRoutes,
    authRoutes
  };
}

/**
 * 获取认证路由
 *
 * @param authRoutes 认证路由
 */
export function getAuthVueRoutes(authRoutes: AutoRouterRoute[]) {
  return transformToVueRoutes(authRoutes, layouts, views);
}
