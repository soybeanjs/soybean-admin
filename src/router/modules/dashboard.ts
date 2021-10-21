import { Dashboard } from '@vicons/carbon';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import { ROUTE_HOME } from '../routes';
import DashboardWorkbench from '@/views/dashboard/workbench/index.vue';

setRouterCacheName(DashboardWorkbench, ROUTE_NAME_MAP.get('dashboard_workbench'));

const DASHBOARD: CustomRoute = {
  name: ROUTE_NAME_MAP.get('dashboard'),
  path: EnumRoutePath.dashboard,
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('dashboard_analysis') },
  meta: {
    title: EnumRouteTitle.dashboard,
    icon: Dashboard
  },
  children: [
    ROUTE_HOME,
    {
      name: ROUTE_NAME_MAP.get('dashboard_workbench'),
      path: EnumRoutePath.dashboard_workbench,
      component: DashboardWorkbench,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        title: EnumRouteTitle.dashboard_workbench
      }
    }
  ]
};

export default DASHBOARD;
