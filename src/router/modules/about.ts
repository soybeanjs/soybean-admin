import type { CustomRoute } from '@/interface';
import { setSingleRoute } from '@/utils';
import { BasicLayout } from '@/layouts';
import About from '@/views/about/index.vue';
import { getRouteConst, routeName } from '../constant';

const { name, path, title } = getRouteConst('about');

const ABOUT: CustomRoute = setSingleRoute({
  route: {
    name,
    path,
    component: About,
    meta: {
      requiresAuth: true,
      title,
      icon: 'fluent:book-information-24-regular'
    }
  },
  container: BasicLayout,
  meta: {
    order: 7
  },
  notFoundName: routeName('not-found')
});

export default ABOUT;
