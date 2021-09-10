import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout, BlankLayout } from '@/layouts';
import { EnumRoutePaths } from '@/enum';
import type { RoutePathKey, LoginModuleType } from '@/interface';
import { getLoginModuleRegExp } from '@/utils';

/** 路由名称 */
export const RouteNameMap = new Map<RoutePathKey, RoutePathKey>(
  (Object.keys(EnumRoutePaths) as RoutePathKey[]).map(v => [v, v])
);

const loginModuleRegExp = getLoginModuleRegExp();

/**
 * 固定不变的路由
 * @description !最后一项重定向未找到的路由须放置路由的最后一项
 */
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    name: 'system',
    path: '/system',
    component: BlankLayout,
    redirect: { name: 'not-found' },
    children: [
      // 登录
      {
        name: RouteNameMap.get('login'),
        path: `${EnumRoutePaths.login}/:module(/${loginModuleRegExp}/)?`,
        component: () => import('@/views/system/login/index.vue'),
        props: route => {
          const moduleType: LoginModuleType = (route.params.module as LoginModuleType) || 'pwd-login';
          return {
            module: moduleType
          };
        },
        meta: {
          fullPage: true
        }
      },
      // 404
      {
        name: RouteNameMap.get('not-found'),
        path: EnumRoutePaths['not-found'],
        component: () => import('@/views/system/exception/404.vue'),
        meta: {
          fullPage: true
        }
      },
      // 403
      {
        name: RouteNameMap.get('no-permission'),
        path: EnumRoutePaths['no-permission'],
        component: () => import('@/views/system/exception/403.vue'),
        meta: {
          fullPage: true
        }
      },
      // 500
      {
        name: RouteNameMap.get('service-error'),
        path: EnumRoutePaths['service-error'],
        component: () => import('@/views/system/exception/500.vue'),
        meta: {
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
export const customRoutes: Array<RouteRecordRaw> = [
  {
    name: 'root',
    path: '/',
    redirect: { name: RouteNameMap.get('dashboard-analysis') }
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: BasicLayout,
    redirect: { name: RouteNameMap.get('dashboard-analysis') },
    children: [
      {
        name: RouteNameMap.get('dashboard-analysis'),
        path: EnumRoutePaths['dashboard-analysis'],
        component: () => import('@/views/dashboard/analysis/index.vue')
      },
      {
        name: RouteNameMap.get('dashboard-workbench'),
        path: EnumRoutePaths['dashboard-workbench'],
        component: () => import('@/views/dashboard/workbench/index.vue')
      }
    ]
  },
  {
    name: 'exception',
    path: '/exception',
    component: BasicLayout,
    children: [
      {
        name: RouteNameMap.get('exception-403'),
        path: EnumRoutePaths['exception-403'],
        component: () => import('@/views/system/exception/403.vue')
      },
      {
        name: RouteNameMap.get('exception-404'),
        path: EnumRoutePaths['exception-404'],
        component: () => import('@/views/system/exception/404.vue')
      },
      {
        name: RouteNameMap.get('exception-500'),
        path: EnumRoutePaths['exception-500'],
        component: () => import('@/views/system/exception/500.vue')
      }
    ]
  }
];
