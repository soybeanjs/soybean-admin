import type { CustomRoute } from '@/interface';
import { setRouterCacheName, setSingleRoute } from '@/utils';
import { BasicLayout } from '@/layouts';
import About from '@/views/about/index.vue';
import { getRouteConst } from '../const';

const { name, path, title } = getRouteConst('about');
setRouterCacheName(About, name);

const ABOUT: CustomRoute = setSingleRoute(BasicLayout, {
  name,
  path,
  component: About,
  meta: {
    requiresAuth: true,
    title,
    icon: 'fluent:book-information-24-regular'
  }
});

export default ABOUT;
