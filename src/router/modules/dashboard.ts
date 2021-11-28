import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import { DashboardAnalysis, DashboardWorkbench } from '@/views';
import { routeName, routePath, routeTitle } from '../constant';

const dashboard: RouteRecordRaw = {
  name: routeName('dashboard'),
  path: routePath('dashboard'),
  component: BasicLayout,
  redirect: { name: routeName('dashboard_analysis') },
  meta: {
    title: routeTitle('dashboard'),
    icon: 'carbon:dashboard',
    order: 1
  },
  children: [
    {
      name: routeName('dashboard_analysis'),
      path: routePath('dashboard_analysis'),
      component: DashboardAnalysis,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        title: routeTitle('dashboard_analysis')
      }
    },
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

export default dashboard;
