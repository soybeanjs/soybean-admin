import type { CustomRoute, ElegantConstRoute, ElegantRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

/**
 * custom routes
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes: CustomRoute[] = [];

/** create routes when the auth route mode is static */
export function createStaticRoutes() {
  const constantRoutes: ElegantRoute[] = [];

  const authRoutes: ElegantRoute[] = [];

  [...customRoutes, ...generatedRoutes].forEach(item => {
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
 * @param routes Elegant routes
 */
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views);
}

/**
 * Get iFrame route names
 *
 * @param routes
 */
export function getIframeRouteNames(routes: ElegantConstRoute[]) {
  const routeNames = [] as string[];
  routes.forEach(route => {
    if (route.component?.indexOf('view.iframe-page') !== -1 && route.props && route.name !== 'iframe-page') {
      routeNames.push(route.name);
    }
    if (route.children?.length) {
      const childNames = getIframeRouteNames(route.children);
      routeNames.push(...childNames);
    }
  });
  return routeNames;
}
