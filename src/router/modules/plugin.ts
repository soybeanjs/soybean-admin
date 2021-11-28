import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import {
  PluginMap,
  PluginVideo,
  PluginEditorQuill,
  PluginEditorMarkdown,
  PluginSwiper,
  PluginCopy,
  PluginIcon,
  PluginPrint
} from '@/views';

import { routeName, routePath, routeTitle } from '../constant';

const plugin: RouteRecordRaw = {
  name: routeName('plugin'),
  path: routePath('plugin'),
  component: BasicLayout,
  redirect: { name: routeName('plugin_map') },
  meta: {
    requiresAuth: true,
    title: routeTitle('plugin'),
    icon: 'clarity:plugin-line',
    order: 3
  },
  children: [
    {
      name: routeName('plugin_map'),
      path: routePath('plugin_map'),
      component: PluginMap,
      meta: {
        requiresAuth: true,
        title: routeTitle('plugin_map'),
        fullPage: true
      }
    },
    {
      name: routeName('plugin_video'),
      path: routePath('plugin_video'),
      component: PluginVideo,
      meta: {
        requiresAuth: true,
        title: routeTitle('plugin_video'),
        fullPage: true
      }
    },
    {
      name: routeName('plugin_editor'),
      path: routePath('plugin_editor'),
      redirect: { name: routeName('plugin_editor_quill') },
      meta: {
        title: routeTitle('plugin_editor')
      },
      children: [
        {
          name: routeName('plugin_editor_quill'),
          path: routePath('plugin_editor_quill'),
          component: PluginEditorQuill,
          meta: {
            requiresAuth: true,
            title: routeTitle('plugin_editor_quill'),
            fullPage: true
          }
        },
        {
          name: routeName('plugin_editor_markdown'),
          path: routePath('plugin_editor_markdown'),
          component: PluginEditorMarkdown,
          meta: {
            requiresAuth: true,
            title: routeTitle('plugin_editor_markdown'),
            fullPage: true
          }
        }
      ]
    },
    {
      name: routeName('plugin_swiper'),
      path: routePath('plugin_swiper'),
      component: PluginSwiper,
      meta: {
        requiresAuth: true,
        title: routeTitle('plugin_swiper')
      }
    },
    {
      name: routeName('plugin_copy'),
      path: routePath('plugin_copy'),
      component: PluginCopy,
      meta: {
        requiresAuth: true,
        title: routeTitle('plugin_copy'),
        fullPage: true
      }
    },
    {
      name: routeName('plugin_icon'),
      path: routePath('plugin_icon'),
      component: PluginIcon,
      meta: {
        requiresAuth: true,
        title: routeTitle('plugin_icon')
      }
    },
    {
      name: routeName('plugin_print'),
      path: routePath('plugin_print'),
      component: PluginPrint,
      meta: {
        requiresAuth: true,
        title: routeTitle('plugin_print')
      }
    }
  ]
};

export default plugin;
