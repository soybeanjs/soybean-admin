import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import MultiMenuFirstSecond from '@/views/multi-menu/first/second/index.vue';
import { routeName, routePath, routeTitle } from '../constant';

const multiMenu: RouteRecordRaw = {
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
      redirect: { name: routeName('multi-menu_first_second') },
      meta: {
        title: routeTitle('multi-menu_first')
      },
      children: [
        {
          name: routeName('multi-menu_first_second'),
          path: routePath('multi-menu_first_second'),
          component: MultiMenuFirstSecond,
          meta: {
            title: routeTitle('multi-menu_first_second'),
            requiresAuth: true,
            keepAlive: true,
            fullPage: true
          }
        }
      ]
    }
  ]
};

export default multiMenu;
