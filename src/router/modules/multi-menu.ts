import type { CustomRoute } from '@/interface';
import { BasicLayout, RouterViewLayout } from '@/layouts';
import MultiMenuFirstSecond from '@/views/multi-menu/first/second/index.vue';
import { routeName, routePath, routeTitle } from '../constant';

const MULTI_MENU: CustomRoute = {
  name: routeName('multi-menu'),
  path: routePath('multi-menu'),
  component: BasicLayout,
  redirect: { name: routeName('multi-menu_first') },
  meta: {
    title: routeTitle('multi-menu'),
    icon: 'carbon:menu',
    order: 6
  },
  children: [
    {
      name: routeName('multi-menu_first'),
      path: routePath('multi-menu_first'),
      component: RouterViewLayout,
      redirect: { name: routeName('multi-menu_first_second') },
      meta: {
        keepAlive: true,
        requiresAuth: true,
        title: routeTitle('multi-menu_first_second')
      },
      children: [
        {
          name: routeName('multi-menu_first_second'),
          path: routePath('multi-menu_first_second'),
          component: MultiMenuFirstSecond,
          meta: {
            keepAlive: true,
            requiresAuth: true,
            title: routeTitle('multi-menu_first_second'),
            fullPage: true
          }
        }
      ]
    }
  ]
};

export default MULTI_MENU;
