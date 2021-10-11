import { Menu } from '@vicons/carbon';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout, BasicChildLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { MultiMenuFirstSecond } from '../components';

const MULTI_MENU: CustomRoute = {
  name: RouteNameMap.get('multi-menu'),
  path: EnumRoutePath['multi-menu'],
  component: BasicLayout,
  redirect: { name: RouteNameMap.get('multi-menu_first') },
  meta: {
    title: EnumRouteTitle['multi-menu'],
    icon: Menu
  },
  children: [
    {
      name: RouteNameMap.get('multi-menu_first'),
      path: EnumRoutePath['multi-menu_first'],
      component: BasicChildLayout,
      redirect: { name: RouteNameMap.get('multi-menu_first_second') },
      meta: {
        keepAlive: true,
        requiresAuth: true,
        title: EnumRouteTitle['multi-menu_first']
      },
      children: [
        {
          name: RouteNameMap.get('multi-menu_first_second'),
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
