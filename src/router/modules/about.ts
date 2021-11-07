import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { ROUTE_NAME_MAP, setRouterCacheName, setSingleRoute } from '@/utils';
import { BasicLayout } from '@/layouts';
import About from '@/views/about/index.vue';

setRouterCacheName(About, ROUTE_NAME_MAP.get('about'));

const ABOUT: CustomRoute = setSingleRoute(BasicLayout, {
  name: ROUTE_NAME_MAP.get('about'),
  path: EnumRoutePath.about,
  component: About,
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.about,
    icon: 'fluent:book-information-24-regular'
  }
});

export default ABOUT;
