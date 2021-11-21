import type { CustomRoute } from '@/interface';
import { BasicLayout } from '@/layouts';
import Exception403 from '@/views/system/exception/403.vue';
import Exception404 from '@/views/system/exception/404.vue';
import Exception500 from '@/views/system/exception/500.vue';
import { routeName, routePath, routeTitle } from '../constant';

const EXCEPTION: CustomRoute = {
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
      component: Exception403,
      meta: {
        requiresAuth: true,
        title: routeTitle('exception_403'),
        fullPage: true
      }
    },
    {
      name: routeName('exception_404'),
      path: routePath('exception_404'),
      component: Exception404,
      meta: {
        requiresAuth: true,
        title: routeTitle('exception_404'),
        fullPage: true
      }
    },
    {
      name: routeName('exception_500'),
      path: routePath('exception_500'),
      component: Exception500,
      meta: {
        requiresAuth: true,
        title: routeTitle('exception_500'),
        fullPage: true
      }
    }
  ]
};

export default EXCEPTION;
