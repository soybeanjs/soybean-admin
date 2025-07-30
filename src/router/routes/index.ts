import type { AutoRouterRoute } from '@elegant-router/types';
import { routes } from '../_generated/routes';
import { layouts, views } from '../_generated/imports';
import { transformToVueRoutes } from '../_generated/transformer';

/** create routes when the auth route mode is static */
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
 * Get auth vue routes
 *
 * @param authRoutes Elegant routes
 */
export function getAuthVueRoutes(authRoutes: AutoRouterRoute[]) {
  return transformToVueRoutes(authRoutes, layouts, views);
}
