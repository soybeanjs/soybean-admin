import { getRouteHome } from '@/utils';
import { routeName } from '../constant';
import customRoutes from '../modules';

/** 路由首页的名字 */
export const ROUTE_HOME_NAME = routeName('dashboard_analysis');

/** 路由首页 */
export const ROUTE_HOME = getRouteHome(customRoutes, ROUTE_HOME_NAME);
