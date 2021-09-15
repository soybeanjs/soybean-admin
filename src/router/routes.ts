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
export const constantRoutes: RouteRecordRaw[] = [
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

/**
 * 自定义路由
 */
export const customRoutes: CustomRoute[] = [
  {
    name: RouteNameMap.get('root'),
    path: EnumRoutePath.root,
    redirect: { name: RouteNameMap.get('dashboard-analysis') },
    meta: {
      asMenu: false
    }
  },
  {
    name: RouteNameMap.get('dashboard'),
    path: EnumRoutePath.dashboard,
    component: BasicLayout,
    redirect: { name: RouteNameMap.get('dashboard-analysis') },
    meta: {
      title: EnumRouteTitle.dashboard,
      asMenu: true,
      icon: Dashboard
    },
    children: [
      {
        name: RouteNameMap.get('dashboard-analysis'),
        path: EnumRoutePath['dashboard-analysis'],
        component: () => import('@/views/dashboard/analysis/index.vue'),
        meta: {
          title: EnumRouteTitle['dashboard-analysis'],
          asMenu: true
        }
      },
      {
        name: RouteNameMap.get('dashboard-workbench'),
        path: EnumRoutePath['dashboard-workbench'],
        component: () => import('@/views/dashboard/workbench/index.vue'),
        meta: {
          title: EnumRouteTitle['dashboard-workbench'],
          asMenu: true
        }
      }
    ]
  },
  {
    name: RouteNameMap.get('exception'),
    path: EnumRoutePath.exception,
    component: BasicLayout,
    meta: {
      title: EnumRouteTitle.exception,
      asMenu: true,
      icon: ExceptionOutlined
    },
    children: [
      {
        name: RouteNameMap.get('exception-403'),
        path: EnumRoutePath['exception-403'],
        component: () => import('@/views/system/exception/403.vue'),
        meta: {
          title: EnumRouteTitle['exception-403'],
          fullPage: true,
          asMenu: true
        }
      },
      {
        name: RouteNameMap.get('exception-404'),
        path: EnumRoutePath['exception-404'],
        component: () => import('@/views/system/exception/404.vue'),
        meta: {
          title: EnumRouteTitle['exception-404'],
          fullPage: true,
          asMenu: true
        }
      },
      {
        name: RouteNameMap.get('exception-500'),
        path: EnumRoutePath['exception-500'],
        component: () => import('@/views/system/exception/500.vue'),
        meta: {
          title: EnumRouteTitle['exception-500'],
          fullPage: true,
          asMenu: true
        }
      }
    ]
  }
];

/** 路由白名单(不需要登录) */
export const whitelistRoutes: string[] = [
  RouteNameMap.get('login')!,
  RouteNameMap.get('exception-403')!,
  RouteNameMap.get('exception-404')!,
  RouteNameMap.get('exception-500')!
];
