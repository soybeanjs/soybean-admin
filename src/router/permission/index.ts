import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { routeName } from '@/router';
import { getToken, getLoginRedirectUrl } from '@/utils';

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
  const isLogin = Boolean(token);
  const needLogin = Boolean(to.meta?.requiresAuth);

  const routerAction: [boolean, () => void][] = [
    // 已登录状态跳转登录页，跳转至首页
    [
      isLogin && to.name === routeName('login'),
      () => {
        next({ name: routeName('root') });
      }
    ],
    // 不需要登录权限的页面直接通行
    [
      !needLogin,
      () => {
        next();
      }
    ],
    // 未登录状态进入需要登录权限的页面
    [
      !isLogin && needLogin,
      () => {
        const redirectUrl = getLoginRedirectUrl();
        next({ name: routeName('login'), query: { redirectUrl } });
      }
    ],
    // 登录状态进入需要登录权限的页面,直接通行
    [
      isLogin && needLogin,
      () => {
        next();
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
