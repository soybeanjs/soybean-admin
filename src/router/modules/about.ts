import type { RouteRecordRaw } from 'vue-router';
import { setSingleRoute } from '@/utils';
import { BasicLayout } from '@/layouts';
import About from '@/views/about/index.vue';
import { getRouteConst, routeName } from '../constant';

const { name, path, title } = getRouteConst('about');

const ABOUT: RouteRecordRaw = setSingleRoute({
  route: {
    name,
    path,
    component: About,
    meta: {
      title,
      requiresAuth: true,
      keepAlive: true,
      icon: 'fluent:book-information-24-regular'
    }
  },
  container: BasicLayout,
  containerMeta: {
    title,
    order: 7
  },
  notFoundName: routeName('not-found')
});

export default ABOUT;
