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
