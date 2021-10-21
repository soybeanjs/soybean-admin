import { getCacheRoutes, transformRouteToMenu } from '@/utils';
import { customRoutes, routes, ROUTE_HOME } from './routes';
import { router, setupRouter } from './setup';

const cacheRoutes = getCacheRoutes(routes);
const menus = transformRouteToMenu(customRoutes);

export { customRoutes, routes, ROUTE_HOME, router, setupRouter, cacheRoutes, menus };
