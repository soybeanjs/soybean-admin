import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import DashboardAnalysis from '@/views/dashboard/analysis/index.vue';
import DashboardWorkbench from '@/views/dashboard/workbench/index.vue';
import { routeName, routePath, routeTitle } from '../constant';

const DASHBOARD: RouteRecordRaw = {
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

export default DASHBOARD;
