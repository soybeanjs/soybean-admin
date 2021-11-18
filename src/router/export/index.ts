import { getCacheRoutes, transformRouteToMenu } from '@/utils';
import { customRoutes, routes } from '../routes';

export const cacheRoutes = getCacheRoutes(routes);
export const menus = transformRouteToMenu(customRoutes);
