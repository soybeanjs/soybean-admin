import { RouteNameMap, setCacheName } from '../helpers';
import DashboardAnalysis from '@/views/dashboard/analysis/index.vue';
import DashboardWorkbench from '@/views/dashboard/workbench/index.vue';

setCacheName(DashboardAnalysis, RouteNameMap.get('dashboard_analysis'));
setCacheName(DashboardWorkbench, RouteNameMap.get('dashboard_workbench'));

export { DashboardAnalysis, DashboardWorkbench };
