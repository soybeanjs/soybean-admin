import type { MockMethod } from 'vite-plugin-mock';

const routes: AuthRoute.Route[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: 'layout',
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
      icon: 'carbon:dashboard'
    }
  },
  {
    name: 'about',
    path: '/about',
    component: 'self',
    meta: {
      title: '关于',
      singleLayout: 'layout',
      permissions: ['super', 'admin', 'test'],
      icon: 'fluent:book-information-24-regular'
    }
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'layout',
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
      title: '多级菜单'
    }
  }
];

const routeHome: AuthRoute.RoutePath = '/dashboard/analysis';

const data: ApiRoute.Route = {
  routes,
  home: routeHome
};

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (): Service.BackendServiceResult => {
      return {
        code: 200,
        message: 'ok',
        data
      };
    }
  }
];

export default apis;
