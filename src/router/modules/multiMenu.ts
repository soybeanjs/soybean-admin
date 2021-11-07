import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout, BasicChildLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import MultiMenuFirstSecond from '@/views/multi-menu/first/second/index.vue';

setRouterCacheName(MultiMenuFirstSecond, ROUTE_NAME_MAP.get('multi-menu_first_second'));

const MULTI_MENU: CustomRoute = {
  name: ROUTE_NAME_MAP.get('multi-menu'),
  path: EnumRoutePath['multi-menu'],
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('multi-menu_first') },
  meta: {
    title: EnumRouteTitle['multi-menu'],
    icon: 'carbon:menu'
  },
  children: [
    {
      name: ROUTE_NAME_MAP.get('multi-menu_first'),
      path: EnumRoutePath['multi-menu_first'],
      component: BasicChildLayout,
      redirect: { name: ROUTE_NAME_MAP.get('multi-menu_first_second') },
      meta: {
        keepAlive: true,
        requiresAuth: true,
        title: EnumRouteTitle['multi-menu_first']
      },
      children: [
        {
          name: ROUTE_NAME_MAP.get('multi-menu_first_second'),
          path: EnumRoutePath['multi-menu_first_second'],
          component: MultiMenuFirstSecond,
          meta: {
            keepAlive: true,
            requiresAuth: true,
            title: EnumRouteTitle['multi-menu_first_second']
          }
        }
      ]
    }
  ]
};

export default MULTI_MENU;
