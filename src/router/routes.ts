import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';

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
      },
      {
        name: 'system',
        path: '/system',
        component: () => import('@/views/system/index.vue')
      }
    ]
  }
];
