import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import { NoPermission, NotFound, ServiceError } from '@/views';
import { routeName, routePath, routeTitle } from '../constant';

const exception: RouteRecordRaw = {
  name: routeName('exception'),
  path: routePath('exception'),
  component: BasicLayout,
  redirect: { name: routeName('exception_403') },
  meta: {
    requiresAuth: true,
    title: routeTitle('exception'),
    icon: 'ant-design:exception-outlined',
    order: 5
  },
  children: [
    {
      name: routeName('exception_403'),
      path: routePath('exception_403'),
      component: NoPermission,
      meta: {
        requiresAuth: true,
        title: routeTitle('exception_403'),
        fullPage: true
      }
    },
    {
      name: routeName('exception_404'),
      path: routePath('exception_404'),
      component: NotFound,
      meta: {
        requiresAuth: true,
        title: routeTitle('exception_404'),
        fullPage: true
      }
    },
    {
      name: routeName('exception_500'),
      path: routePath('exception_500'),
      component: ServiceError,
      meta: {
        requiresAuth: true,
        title: routeTitle('exception_500'),
        fullPage: true
      }
    }
  ]
};

export default exception;
