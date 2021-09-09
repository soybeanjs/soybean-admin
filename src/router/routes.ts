import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout, BlankLayout } from '@/layouts';
import { EnumRoutePaths } from '@/enum';

type RouteKey = keyof typeof EnumRoutePaths;

/** 路由名称 */
export const RouteNameMap = new Map<RouteKey, RouteKey>((Object.keys(EnumRoutePaths) as RouteKey[]).map(v => [v, v]));

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
        path: EnumRoutePaths.login,
        component: () => import('@/views/system/login/index.vue')
      },
      // 404
      {
        name: RouteNameMap.get('not-found'),
        path: EnumRoutePaths['not-found'],
        component: () => import('@/views/system/exception/404.vue')
      },
      // 403
      {
        name: RouteNameMap.get('no-permission'),
        path: EnumRoutePaths['no-permission'],
        component: () => import('@/views/system/exception/403.vue')
      },
      // 500
      {
        name: RouteNameMap.get('service-error'),
        path: EnumRoutePaths['service-error'],
        component: () => import('@/views/system/exception/500.vue')
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
    redirect: '/home',
    component: BasicLayout,
    children: [
      {
        name: 'home',
        path: '/home',
        component: () => import('@/views/home/index.vue')
      }
    ]
  }
];
