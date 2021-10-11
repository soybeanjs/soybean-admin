import { getCacheRoutes, transformRouteToMenu } from './helpers';
import { customRoutes, routes } from './routes';

export { router, setupRouter } from './setup';
export { ROUTE_HOME, customRoutes, routes } from './routes';
export { RouteNameMap } from './helpers';

export const cacheRoutes = getCacheRoutes(routes);
export const menus = transformRouteToMenu(customRoutes);
