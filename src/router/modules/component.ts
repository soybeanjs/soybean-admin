import type { CustomRoute } from '@/interface';
import { BasicLayout, RouterViewLayout } from '@/layouts';
import { setRouterCacheName } from '@/utils';
import ComponentMap from '@/views/component/map/index.vue';
import ComponentVideo from '@/views/component/video/index.vue';
import EditorQuill from '@/views/component/editor/quill/index.vue';
import EditorMarkdown from '@/views/component/editor/markdown/index.vue';
import ComponentSwiper from '@/views/component/swiper/index.vue';
import { routeName, routePath, routeTitle } from '../const';

setRouterCacheName(ComponentMap, routeName('component_map'));
setRouterCacheName(ComponentVideo, routeName('component_video'));
setRouterCacheName(EditorQuill, routeName('component_editor_quill'));
setRouterCacheName(EditorMarkdown, routeName('component_editor_markdown'));
setRouterCacheName(ComponentSwiper, routeName('component_swiper'));

const COMPONENT: CustomRoute = {
  name: routeName('component'),
  path: routePath('component'),
  component: BasicLayout,
  redirect: { name: routeName('component_map') },
  meta: {
    requiresAuth: true,
    title: routeTitle('component'),
    icon: 'fluent:app-store-24-regular'
  },
  children: [
    {
      name: routeName('component_map'),
      path: routePath('component_map'),
      component: ComponentMap,
      meta: {
        requiresAuth: true,
        title: routeTitle('component_map'),
        fullPage: true
      }
    },
    {
      name: routeName('component_video'),
      path: routePath('component_video'),
      component: ComponentVideo,
      meta: {
        requiresAuth: true,
        title: routeTitle('component_video'),
        fullPage: true
      }
    },
    {
      name: routeName('component_editor'),
      path: routePath('component_editor'),
      component: RouterViewLayout,
      redirect: { name: routeName('component_editor_quill') },
      meta: {
        requiresAuth: true,
        title: routeTitle('component_editor'),
        fullPage: true
      },
      children: [
        {
          name: routeName('component_editor_quill'),
          path: routePath('component_editor_quill'),
          component: EditorQuill,
          meta: {
            requiresAuth: true,
            title: routeTitle('component_editor_quill'),
            fullPage: true
          }
        },
        {
          name: routeName('component_editor_markdown'),
          path: routePath('component_editor_markdown'),
          component: EditorMarkdown,
          meta: {
            requiresAuth: true,
            title: routeTitle('component_editor_markdown'),
            fullPage: true
          }
        }
      ]
    },
    {
      name: routeName('component_swiper'),
      path: routePath('component_swiper'),
      component: ComponentSwiper,
      meta: {
        requiresAuth: true,
        title: routeTitle('component_swiper')
      }
    }
  ]
};

export default COMPONENT;
