import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import { ComponentButton, ComponentCard } from '@/views';
import { routeName, routePath, routeTitle } from '../constant';

const component: RouteRecordRaw = {
  name: routeName('component'),
  path: routePath('component'),
  component: BasicLayout,
  redirect: { name: routeName('component_button') },
  meta: {
    title: routeTitle('component'),
    icon: 'fluent:app-store-24-regular',
    order: 4
  },
  children: [
    {
      name: routeName('component_button'),
      path: routePath('component_button'),
      component: ComponentButton,
      meta: {
        title: routeTitle('component_button'),
        requiresAuth: true,
        keepAlive: true
      }
    },
    {
      name: routeName('component_card'),
      path: routePath('component_card'),
      component: ComponentCard,
      meta: {
        title: routeTitle('component_card'),
        requiresAuth: true,
        keepAlive: true
      }
    }
  ]
};

export default component;
