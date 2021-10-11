import { ExceptionOutlined } from '@vicons/antd';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { Exception403, Exception404, Exception500 } from '../components';

const EXCEPTION: CustomRoute = {
  name: RouteNameMap.get('exception'),
  path: EnumRoutePath.exception,
  component: BasicLayout,
  redirect: { name: RouteNameMap.get('exception_403') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.exception,
    icon: ExceptionOutlined
  },
  children: [
    {
      name: RouteNameMap.get('exception_403'),
      path: EnumRoutePath.exception_403,
      component: Exception403,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.exception_403,
        fullPage: true
      }
    },
    {
      name: RouteNameMap.get('exception_404'),
      path: EnumRoutePath.exception_404,
      component: Exception404,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.exception_404,
        fullPage: true
      }
    },
    {
      name: RouteNameMap.get('exception_500'),
      path: EnumRoutePath.exception_500,
      component: Exception500,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.exception_500,
        fullPage: true
      }
    }
  ]
};

export default EXCEPTION;
