import { ExceptionOutlined } from '@vicons/antd';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import Exception403 from '@/views/system/exception/403.vue';
import Exception404 from '@/views/system/exception/404.vue';
import Exception500 from '@/views/system/exception/500.vue';

setRouterCacheName(Exception404, ROUTE_NAME_MAP.get('exception_404'));
setRouterCacheName(Exception403, ROUTE_NAME_MAP.get('exception_403'));
setRouterCacheName(Exception500, ROUTE_NAME_MAP.get('exception_500'));

const EXCEPTION: CustomRoute = {
  name: ROUTE_NAME_MAP.get('exception'),
  path: EnumRoutePath.exception,
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('exception_403') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.exception,
    icon: ExceptionOutlined
  },
  children: [
    {
      name: ROUTE_NAME_MAP.get('exception_403'),
      path: EnumRoutePath.exception_403,
      component: Exception403,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.exception_403,
        fullPage: true
      }
    },
    {
      name: ROUTE_NAME_MAP.get('exception_404'),
      path: EnumRoutePath.exception_404,
      component: Exception404,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.exception_404,
        fullPage: true
      }
    },
    {
      name: ROUTE_NAME_MAP.get('exception_500'),
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
