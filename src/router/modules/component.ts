import { AppStore24Regular } from '@vicons/fluent';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import ComponentMap from '@/views/component/map/index.vue';
import ComponentVideo from '@/views/component/video/index.vue';

setRouterCacheName(ComponentMap, ROUTE_NAME_MAP.get('component_map'));
setRouterCacheName(ComponentVideo, ROUTE_NAME_MAP.get('component_video'));

const COMPONENT: CustomRoute = {
  name: ROUTE_NAME_MAP.get('component'),
  path: EnumRoutePath.component,
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('component_map') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.component,
    icon: AppStore24Regular
  },
  children: [
    {
      name: ROUTE_NAME_MAP.get('component_map'),
      path: EnumRoutePath.component_map,
      component: ComponentMap,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.component_map,
        fullPage: true
      }
    },
    {
      name: ROUTE_NAME_MAP.get('component_video'),
      path: EnumRoutePath.component_video,
      component: ComponentVideo,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.component_video,
        fullPage: true
      }
    }
  ]
};

export default COMPONENT;
