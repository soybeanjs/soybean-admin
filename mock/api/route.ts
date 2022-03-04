import type { MockMethod } from 'vite-plugin-mock';

const routes: AuthRoute.Route[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: 'basic',
    children: [
      {
        name: 'dashboard_analysis',
        path: '/dashboard/analysis',
        component: 'self',
        meta: {
          title: '分析页',
          requiresAuth: true,
          icon: 'icon-park-outline:analysis'
        }
      },
      {
        name: 'dashboard_workbench',
        path: '/dashboard/workbench',
        component: 'self',
        meta: {
          title: '工作台',
          requiresAuth: true,
          permissions: ['super', 'admin'],
          icon: 'icon-park-outline:workbench'
        }
      }
    ],
    meta: {
      title: '仪表盘',
      icon: 'carbon:dashboard',
      order: 1
    }
  },
  {
    name: 'document',
    path: '/document',
    component: 'basic',
    children: [
      {
        name: 'document_vue',
        path: '/document/vue',
        component: 'self',
        meta: {
          title: 'vue文档',
          requiresAuth: true,
          icon: 'mdi:vuejs'
        }
      },
      {
        name: 'document_vue-new',
        path: '/document/vue-new',
        component: 'self',
        meta: {
          title: 'vue文档(新版)',
          requiresAuth: true,
          icon: 'mdi:vuejs'
        }
      },
      {
        name: 'document_vite',
        path: '/document/vite',
        component: 'self',
        meta: {
          title: 'vite文档',
          requiresAuth: true,
          icon: 'simple-icons:vite'
        }
      },
      {
        name: 'document_naive',
        path: '/document/naive',
        component: 'self',
        meta: {
          title: 'naive文档',
          requiresAuth: true,
          icon: 'mdi:alpha-n-box-outline'
        }
      },
      {
        name: 'document_project',
        path: '/document/project',
        meta: {
          title: '项目文档(外链)',
          requiresAuth: true,
          icon: 'mdi:file-link-outline',
          href: 'https://docs.soybean.pro/'
        }
      }
    ],
    meta: {
      title: '文档',
      icon: 'carbon:document',
      order: 2
    }
  },
  {
    name: 'component',
    path: '/component',
    component: 'basic',
    children: [
      {
        name: 'component_button',
        path: '/component/button',
        component: 'self',
        meta: {
          title: '按钮',
          requiresAuth: true,
          icon: 'ic:baseline-radio-button-checked'
        }
      },
      {
        name: 'component_card',
        path: '/component/card',
        component: 'self',
        meta: {
          title: '卡片',
          requiresAuth: true,
          icon: 'mdi:card-outline'
        }
      },
      {
        name: 'component_table',
        path: '/component/table',
        component: 'self',
        meta: {
          title: '表格',
          requiresAuth: true,
          icon: 'mdi:table-large'
        }
      }
    ],
    meta: {
      title: '组件示例',
      icon: 'fluent:app-store-24-regular',
      order: 3
    }
  },
  {
    name: 'plugin',
    path: '/plugin',
    component: 'basic',
    children: [
      {
        name: 'plugin_map',
        path: '/plugin/map',
        component: 'self',
        meta: {
          title: '地图',
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
              requiresAuth: true,
              icon: 'ri:markdown-line'
            }
          }
        ],
        meta: {
          title: '编辑器',
          icon: 'icon-park-outline:editor'
        }
      },
      {
        name: 'plugin_swiper',
        path: '/plugin/swiper',
        component: 'self',
        meta: {
          title: 'Swiper插件',
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
          requiresAuth: true,
          icon: 'ic:baseline-insert-emoticon'
        }
      },
      {
        name: 'plugin_print',
        path: '/plugin/print',
        component: 'self',
        meta: {
          title: '打印',
          requiresAuth: true,
          icon: 'ic:baseline-local-printshop'
        }
      }
    ],
    meta: {
      title: '插件示例',
      icon: 'clarity:plugin-line',
      order: 4
    }
  },
  {
    name: 'exception',
    path: '/exception',
    component: 'basic',
    children: [
      {
        name: 'exception_403',
        path: '/exception/403',
        component: 'self',
        meta: {
          title: '异常页403',
          requiresAuth: true,
          icon: 'ic:baseline-block'
        }
      },
      {
        name: 'exception_404',
        path: '/exception/404',
        component: 'self',
        meta: {
          title: '异常页404',
          requiresAuth: true,
          icon: 'ic:baseline-web-asset-off'
        }
      },
      {
        name: 'exception_500',
        path: '/exception/500',
        component: 'self',
        meta: {
          title: '异常页500',
          requiresAuth: true,
          icon: 'ic:baseline-wifi-off'
        }
      }
    ],
    meta: {
      title: '异常页',
      icon: 'ant-design:exception-outlined',
      order: 5
    }
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'basic',
    children: [
      {
        name: 'multi-menu_first',
        path: '/multi-menu/first',
        component: 'multi',
        children: [
          {
            name: 'multi-menu_first_second',
            path: '/multi-menu/first/second',
            component: 'self',
            meta: {
              title: '二级菜单',
              requiresAuth: true,
              icon: 'ic:outline-menu'
            }
          },
          {
            name: 'multi-menu_first_second-new',
            path: '/multi-menu/first/second-new',
            component: 'multi',
            children: [
              {
                name: 'multi-menu_first_second-new_third',
                path: '/multi-menu/first/second-new/third',
                component: 'self',
                meta: {
                  title: '三级菜单',
                  requiresAuth: true,
                  icon: 'ic:outline-menu'
                }
              }
            ],
            meta: {
              title: '二级菜单(有子菜单)',
              icon: 'ic:outline-menu'
            }
          }
        ],
        meta: {
          title: '一级菜单',
          icon: 'ic:outline-menu'
        }
      }
    ],
    meta: {
      title: '多级菜单',
      icon: 'carbon:menu',
      order: 6
    }
  },
  {
    name: 'about',
    path: '/about',
    component: 'self',
    meta: {
      title: '关于',
      requiresAuth: true,
      singleLayout: 'basic',
      permissions: ['super', 'admin', 'test'],
      icon: 'fluent:book-information-24-regular',
      order: 7
    }
  }
];

function dataMiddleware(data: AuthRoute.Route[]): ApiRoute.Route {
  const routeHomeName: AuthRoute.RouteKey = 'dashboard_analysis';

  function sortRoutes(sorts: AuthRoute.Route[]) {
    return sorts.sort((next, pre) => Number(next.meta?.order) - Number(pre.meta?.order));
  }

  return {
    routes: sortRoutes(data),
    home: routeHomeName
  };
}

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (): Service.MockServiceResult => {
      return {
        code: 200,
        message: 'ok',
        data: dataMiddleware(routes)
      };
    }
  }
];

export default apis;
