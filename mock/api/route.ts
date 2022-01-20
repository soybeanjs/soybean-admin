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
          title: '分析页'
        }
      },
      {
        name: 'dashboard_workbench',
        path: '/dashboard/workbench',
        component: 'self',
        meta: {
          title: '工作台',
          permissions: ['super', 'admin']
        }
      }
    ],
    meta: {
      title: '仪表盘',
      requiresAuth: true,
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
          title: 'vue文档'
        }
      },
      {
        name: 'document_vue-new',
        path: '/document/vue-new',
        component: 'self',
        meta: {
          title: 'vue文档(新版)'
        }
      },
      {
        name: 'document_vite',
        path: '/document/vite',
        component: 'self',
        meta: {
          title: 'vite文档'
        }
      },
      {
        name: 'document_naive',
        path: '/document/naive',
        component: 'self',
        meta: {
          title: 'naive文档'
        }
      },
      {
        name: 'document_project',
        path: '/document/project',
        meta: {
          title: '项目文档(外链)',
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
    name: 'about',
    path: '/about',
    component: 'self',
    meta: {
      title: '关于',
      singleLayout: 'basic',
      permissions: ['super', 'admin', 'test'],
      icon: 'fluent:book-information-24-regular',
      order: 7
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
          title: '异常页403'
        }
      },
      {
        name: 'exception_404',
        path: '/exception/404',
        component: 'self',
        meta: {
          title: '异常页404'
        }
      },
      {
        name: 'exception_500',
        path: '/exception/500',
        component: 'self',
        meta: {
          title: '异常页500'
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
              title: '二级菜单'
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
                  title: '三级菜单'
                }
              }
            ],
            meta: {
              title: '二级菜单(有子菜单)'
            }
          }
        ],
        meta: {
          title: '一级菜单'
        }
      }
    ],
    meta: {
      title: '多级菜单',
      icon: 'carbon:menu',
      order: 6
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
    response: (): Service.BackendServiceResult => {
      return {
        code: 200,
        message: 'ok',
        data: dataMiddleware(routes)
      };
    }
  }
];

export default apis;
