import type { CustomRoute } from '@/interface';
import { BasicLayout } from '@/layouts';
import { setRouterCacheName } from '@/utils';
import DashboardWorkbench from '@/views/dashboard/workbench/index.vue';
import { ROUTE_HOME } from '../routes';
import { routeName, routePath, routeTitle } from '../const';

setRouterCacheName(DashboardWorkbench, routeName('dashboard_workbench'));

const DASHBOARD: CustomRoute = {
  name: routeName('dashboard'),
  path: routePath('dashboard'),
  component: BasicLayout,
  redirect: { name: routeName('dashboard_analysis') },
  meta: {
    title: routeTitle('dashboard'),
    icon: 'carbon:dashboard'
  },
  children: [
    ROUTE_HOME,
    {
      name: routeName('dashboard_workbench'),
      path: routePath('dashboard_workbench'),
      component: DashboardWorkbench,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        title: routeTitle('dashboard_workbench')
      }
    }
  ]
};

export default DASHBOARD;
