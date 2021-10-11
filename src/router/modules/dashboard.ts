import { Dashboard } from '@vicons/carbon';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { DashboardWorkbench } from '../components';
import { ROUTE_HOME } from '../routes';

const DASHBOARD: CustomRoute = {
  name: RouteNameMap.get('dashboard'),
  path: EnumRoutePath.dashboard,
  component: BasicLayout,
  redirect: { name: RouteNameMap.get('dashboard_analysis') },
  meta: {
    title: EnumRouteTitle.dashboard,
    icon: Dashboard
  },
  children: [
    ROUTE_HOME,
    {
      name: RouteNameMap.get('dashboard_workbench'),
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
