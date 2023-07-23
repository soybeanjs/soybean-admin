const plugin: AuthRoute.Route = {
  name: 'plugin',
  path: '/plugin',
  component: 'basic',
  children: [
    {
      name: 'plugin_charts',
      path: '/plugin/charts',
      component: 'multi',
      children: [
        {
          name: 'plugin_charts_echarts',
          path: '/plugin/charts/echarts',
          component: 'self',
          meta: {
            title: 'ECharts',
            i18nTitle: 'routes.plugin.charts.echarts',
            requiresAuth: true,
            icon: 'simple-icons:apacheecharts'
          }
        },
        {
          name: 'plugin_charts_antv',
          path: '/plugin/charts/antv',
          component: 'self',
          meta: {
            title: 'AntV',
            i18nTitle: 'routes.plugin.charts.antv',
            requiresAuth: true,
            icon: 'simple-icons:antdesign'
          }
        }
      ],
      meta: {
        title: '图表',
        i18nTitle: 'routes.plugin.charts._value',
        icon: 'mdi:chart-areaspline'
      }
    },
    {
      name: 'plugin_map',
      path: '/plugin/map',
      component: 'self',
      meta: {
        title: '地图',
        i18nTitle: 'routes.plugin.map',
        requiresAuth: true,
        icon: 'mdi:map'
      }
    },
    {
      name: 'plugin_video',
      path: '/plugin/video',
      component: 'self',
      meta: {
        title: '视频',
        i18nTitle: 'routes.plugin.video',
        requiresAuth: true,
        icon: 'mdi:video'
      }
    },
    {
      name: 'plugin_editor',
      path: '/plugin/editor',
      component: 'multi',
      children: [
        {
          name: 'plugin_editor_quill',
          path: '/plugin/editor/quill',
          component: 'self',
          meta: {
            title: '富文本编辑器',
            i18nTitle: 'routes.plugin.editor.quill',
            requiresAuth: true,
            icon: 'mdi:file-document-edit-outline'
          }
        },
        {
          name: 'plugin_editor_markdown',
          path: '/plugin/editor/markdown',
          component: 'self',
          meta: {
            title: 'markdown编辑器',
            i18nTitle: 'routes.plugin.editor.markdown',
            requiresAuth: true,
            icon: 'ri:markdown-line'
          }
        }
      ],
      meta: {
        title: '编辑器',
        i18nTitle: 'routes.plugin.editor._value',
        icon: 'icon-park-outline:editor'
      }
    },
    {
      name: 'plugin_swiper',
      path: '/plugin/swiper',
      component: 'self',
      meta: {
        title: 'Swiper插件',
        i18nTitle: 'routes.plugin.swiper',
        requiresAuth: true,
        icon: 'simple-icons:swiper'
      }
    },
    {
      name: 'plugin_copy',
      path: '/plugin/copy',
      component: 'self',
      meta: {
        title: '剪贴板',
        i18nTitle: 'routes.plugin.copy',
        requiresAuth: true,
        icon: 'mdi:clipboard-outline'
      }
    },
    {
      name: 'plugin_icon',
      path: '/plugin/icon',
      component: 'self',
      meta: {
        title: '图标',
        i18nTitle: 'routes.plugin.icon',
        requiresAuth: true,
        localIcon: 'custom-icon'
      }
    },
    {
      name: 'plugin_print',
      path: '/plugin/print',
      component: 'self',
      meta: {
        title: '打印',
        i18nTitle: 'routes.plugin.print',
        requiresAuth: true,
        icon: 'mdi:printer'
      }
    }
  ],
  meta: {
    title: '插件示例',
    i18nTitle: 'routes.plugin._value',
    icon: 'clarity:plugin-line',
    order: 4
  }
};

export default plugin;
