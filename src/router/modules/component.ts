import { AppStore24Regular } from '@vicons/fluent';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { ComponentMap, ComponentVideo } from '../components';

const COMPONENT: CustomRoute = {
  name: RouteNameMap.get('component'),
  path: EnumRoutePath.component,
  component: BasicLayout,
  redirect: { name: RouteNameMap.get('component_map') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.component,
    icon: AppStore24Regular
  },
  children: [
    {
      name: RouteNameMap.get('component_map'),
      path: EnumRoutePath.component_map,
      component: ComponentMap,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.component_map,
        fullPage: true
      }
    },
    {
      name: RouteNameMap.get('component_video'),
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
