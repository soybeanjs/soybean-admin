import { RouteNameMap, setCacheName } from '../helpers';
import Login from '@/views/system/login/index.vue';
import NoPermission from '@/views/system/exception/403.vue';
import NotFound from '@/views/system/exception/404.vue';
import ServiceError from '@/views/system/exception/500.vue';
import DashboardAnalysis from '@/views/dashboard/analysis/index.vue';
import DashboardWorkbench from '@/views/dashboard/workbench/index.vue';
import MultiMenuFirstSecond from '@/views/multi-menu/first/second/index.vue';

const Exception403 = { ...NoPermission };
const Exception404 = { ...NotFound };
const Exception500 = { ...ServiceError };

setCacheName(Login, RouteNameMap.get('login'));
setCacheName(NoPermission, RouteNameMap.get('no-permission'));
setCacheName(NotFound, RouteNameMap.get('not-found'));
setCacheName(ServiceError, RouteNameMap.get('service-error'));
setCacheName(DashboardAnalysis, RouteNameMap.get('dashboard_analysis'));
setCacheName(DashboardWorkbench, RouteNameMap.get('dashboard_workbench'));
setCacheName(MultiMenuFirstSecond, RouteNameMap.get('multi-menu_first_second'));
setCacheName(Exception404, RouteNameMap.get('exception_404'));
setCacheName(Exception403, RouteNameMap.get('exception_403'));
setCacheName(Exception500, RouteNameMap.get('exception_500'));

export {
  Login,
  NoPermission,
  NotFound,
  ServiceError,
  DashboardAnalysis,
  DashboardWorkbench,
  Exception403,
  Exception404,
  Exception500,
  MultiMenuFirstSecond
};
