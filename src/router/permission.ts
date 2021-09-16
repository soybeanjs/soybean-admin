import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { getToken } from '@/utils';
import { RouteNameMap } from './routes';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export default function createRouterGuide(router: Router) {
  router.beforeEach((to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start();
    // 页面跳转逻辑
    handleRouterAction(to, from, next);
  });
  router.afterEach(to => {
    // 设置document title
    useTitle(to.meta.title as string);
    // 结束 loadingBar
    window.$loadingBar?.finish();
  });
}

function handleRouterAction(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const token = getToken();
  const routerAction: [boolean, () => void][] = [
    // 已登录状态跳转登录页，跳转至首页
    [
      to.name === RouteNameMap.get('login') && Boolean(token),
      () => {
        next({ name: RouteNameMap.get('root') });
      }
    ],
    // 不需要权限的页面直接通行
    [
      !to.meta?.requiresAuth,
      () => {
        next();
      }
    ],
    // 需要权限的页面
    [
      Boolean(to.meta?.requiresAuth),
      () => {
        if (token) {
          // 有权限直接通行
          next();
        } else {
          // 没有权限，跳转至登录页
          const redirectUrl = window.location.href;
          next({ name: RouteNameMap.get('login'), query: { redirectUrl } });
        }
      }
    ]
  ];

  routerAction.some(item => {
    const flag = item[0];
    if (flag) {
      item[1]();
    }
    return flag;
  });
}
