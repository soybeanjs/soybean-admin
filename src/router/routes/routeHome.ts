import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { RouteNameMap } from '../helpers';
import { DashboardAnalysis } from '../components';

/** 路由首页 */
const ROUTE_HOME: CustomRoute = {
  name: RouteNameMap.get('dashboard_analysis'),
  path: EnumRoutePath.dashboard_analysis,
  component: DashboardAnalysis,
  meta: {
    keepAlive: true,
    requiresAuth: true,
    title: EnumRouteTitle.dashboard_analysis
  }
};

export default ROUTE_HOME;
