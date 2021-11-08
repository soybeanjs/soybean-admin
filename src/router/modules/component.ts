import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout, BasicChildLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import ComponentMap from '@/views/component/map/index.vue';
import ComponentVideo from '@/views/component/video/index.vue';
import EditorQuill from '@/views/component/editor/quill/index.vue';
import EditorMarkdown from '@/views/component/editor/markdown/index.vue';

setRouterCacheName(ComponentMap, ROUTE_NAME_MAP.get('component_map'));
setRouterCacheName(ComponentVideo, ROUTE_NAME_MAP.get('component_video'));
setRouterCacheName(EditorQuill, ROUTE_NAME_MAP.get('component_editor_quill'));
setRouterCacheName(EditorMarkdown, ROUTE_NAME_MAP.get('component_editor_markdown'));

const COMPONENT: CustomRoute = {
  name: ROUTE_NAME_MAP.get('component'),
  path: EnumRoutePath.component,
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('component_map') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.component,
    icon: 'fluent:app-store-24-regular'
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
    },
    {
      name: ROUTE_NAME_MAP.get('component_editor'),
      path: EnumRoutePath.component_editor,
      component: BasicChildLayout,
      redirect: { name: ROUTE_NAME_MAP.get('component_editor_quill') },
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.component_editor,
        fullPage: true
      },
      children: [
        {
          name: ROUTE_NAME_MAP.get('component_editor_quill'),
          path: EnumRoutePath.component_editor_quill,
          component: EditorQuill,
          meta: {
            requiresAuth: true,
            title: EnumRouteTitle.component_editor_quill,
            fullPage: true
          }
        },
        {
          name: ROUTE_NAME_MAP.get('component_editor_markdown'),
          path: EnumRoutePath.component_editor_markdown,
          component: EditorMarkdown,
          meta: {
            requiresAuth: true,
            title: EnumRouteTitle.component_editor_markdown,
            fullPage: true
          }
        }
      ]
    }
  ]
};

export default COMPONENT;
