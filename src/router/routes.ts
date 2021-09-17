import type { RouteRecordRaw } from 'vue-router';
import { Dashboard } from '@vicons/carbon';
import { ExceptionOutlined } from '@vicons/antd';
import { BasicLayout, BlankLayout } from '@/layouts';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import type { CustomRoute, RoutePathKey, LoginModuleType } from '@/interface';
import { getLoginModuleRegExp } from '@/utils';

/** 路由名称 */
export const RouteNameMap = new Map<RoutePathKey, RoutePathKey>(
  (Object.keys(EnumRoutePath) as RoutePathKey[]).map(v => [v, v])
);

const loginModuleRegExp = getLoginModuleRegExp();

/**
 * 固定不变的路由
 * @description !最后一项重定向未找到的路由须放置路由的最后一项
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    name: RouteNameMap.get('system'),
    path: EnumRoutePath.system,
    component: BlankLayout,
    redirect: { name: RouteNameMap.get('not-found') },
    meta: {
      title: EnumRouteTitle.system
    },
    children: [
      // 登录
      {
        name: RouteNameMap.get('login'),
        path: `${EnumRoutePath.login}/:module(/${loginModuleRegExp}/)?`,
        component: () => import('@/views/system/login/index.vue'),
        props: route => {
          const moduleType: LoginModuleType = (route.params.module as LoginModuleType) || 'pwd-login';
          return {
            module: moduleType
          };
        },
        meta: {
          title: EnumRouteTitle.login,
          fullPage: true
        }
      },
      // 404
      {
        name: RouteNameMap.get('not-found'),
        path: EnumRoutePath['not-found'],
        component: () => import('@/views/system/exception/404.vue'),
        meta: {
          title: EnumRouteTitle['not-found'],
          fullPage: true
        }
      },
      // 403
      {
        name: RouteNameMap.get('no-permission'),
        path: EnumRoutePath['no-permission'],
        component: () => import('@/views/system/exception/403.vue'),
        meta: {
          title: EnumRouteTitle['no-permission'],
          fullPage: true
        }
      },
      // 500
      {
        name: RouteNameMap.get('service-error'),
        path: EnumRoutePath['service-error'],
        component: () => import('@/views/system/exception/500.vue'),
        meta: {
          title: EnumRouteTitle['service-error'],
          fullPage: true
        }
      }
    ]
  },
  // 匹配无效的路径重定向404
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'not-found' }
  }
];

/** 路由首页 */
export const ROUTE_HOME: CustomRoute = {
  name: RouteNameMap.get('dashboard-analysis'),
  path: EnumRoutePath['dashboard-analysis'],
  component: () => import('@/views/dashboard/analysis/index.vue'),
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle['dashboard-analysis']
  }
};

/**
 * 自定义路由
 */
export const customRoutes: CustomRoute[] = [
  {
    name: RouteNameMap.get('root'),
    path: EnumRoutePath.root,
    component: BasicLayout,
    redirect: { name: ROUTE_HOME.name },
    meta: {
      isNotMenu: true
    },
    children: [
      // 重载
      {
        name: RouteNameMap.get('reload'),
        path: EnumRoutePath.reload,
        component: () => import('@/views/system/reload/index.vue'),
        meta: {
          title: EnumRouteTitle.reload,
          isNotMenu: true,
          fullPage: true
        }
      }
    ]
  },
  {
    name: RouteNameMap.get('dashboard'),
    path: EnumRoutePath.dashboard,
    component: BasicLayout,
    redirect: { name: RouteNameMap.get('dashboard-analysis') },
    meta: {
      title: EnumRouteTitle.dashboard,
      keepAlive: true,
      icon: Dashboard
    },
    children: [
      ROUTE_HOME,
      {
        name: RouteNameMap.get('dashboard-workbench'),
        path: EnumRoutePath['dashboard-workbench'],
        component: () => import('@/views/dashboard/workbench/index.vue'),
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['dashboard-workbench']
        }
      }
    ]
  },
  {
    name: RouteNameMap.get('exception'),
    path: EnumRoutePath.exception,
    component: BasicLayout,
    meta: {
      requiresAuth: true,
      title: EnumRouteTitle.exception,
      icon: ExceptionOutlined
    },
    children: [
      {
        name: RouteNameMap.get('exception-403'),
        path: EnumRoutePath['exception-403'],
        component: () => import('@/views/system/exception/403.vue'),
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['exception-403'],
          fullPage: true
        }
      },
      {
        name: RouteNameMap.get('exception-404'),
        path: EnumRoutePath['exception-404'],
        component: () => import('@/views/system/exception/404.vue'),
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['exception-404'],
          fullPage: true
        }
      },
      {
        name: RouteNameMap.get('exception-500'),
        path: EnumRoutePath['exception-500'],
        component: () => import('@/views/system/exception/500.vue'),
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['exception-500'],
          fullPage: true
        }
      }
    ]
  }
];

/** 所有路由 */
export const routes: RouteRecordRaw[] = [...customRoutes, ...constantRoutes];
