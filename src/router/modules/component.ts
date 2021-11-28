import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import ComponentMap from '@/views/component/map/index.vue';
import ComponentVideo from '@/views/component/video/index.vue';
import EditorQuill from '@/views/component/editor/quill/index.vue';
import EditorMarkdown from '@/views/component/editor/markdown/index.vue';
import ComponentSwiper from '@/views/component/swiper/index.vue';
import { routeName, routePath, routeTitle } from '../constant';

const COMPONENT: RouteRecordRaw = {
  name: routeName('component'),
  path: routePath('component'),
  component: BasicLayout,
  redirect: { name: routeName('component_map') },
  meta: {
    requiresAuth: true,
    title: routeTitle('component'),
    icon: 'fluent:app-store-24-regular',
    order: 3
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
      redirect: { name: routeName('component_editor_quill') },
      meta: {
        title: routeTitle('component_editor')
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
