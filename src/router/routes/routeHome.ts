import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import DashboardAnalysis from '@/views/dashboard/analysis/index.vue';

setRouterCacheName(DashboardAnalysis, ROUTE_NAME_MAP.get('dashboard_analysis'));

/** 路由首页 */
const ROUTE_HOME: CustomRoute = {
  name: ROUTE_NAME_MAP.get('dashboard_analysis'),
  path: EnumRoutePath.dashboard_analysis,
  component: DashboardAnalysis,
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.dashboard_analysis
  }
};

export default ROUTE_HOME;
