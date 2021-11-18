import type { CustomRoute } from '@/interface';
import { setRouterCacheName } from '@/utils';
import DashboardAnalysis from '@/views/dashboard/analysis/index.vue';
import { getRouteConst } from '../const';

const { name, path, title } = getRouteConst('dashboard_analysis');

setRouterCacheName(DashboardAnalysis, name);

/** 路由首页 */
const ROUTE_HOME: CustomRoute = {
  name,
  path,
  component: DashboardAnalysis,
  meta: {
    requiresAuth: true,
    title
  }
};

export default ROUTE_HOME;
