import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { routeName } from '@/router';
import { getToken, getLoginRedirectUrl } from '@/utils';

type RouterAction = [boolean, () => void];

/** 处理页面的权限 */
export function handlePagePermission(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const token = getToken();
  const isLogin = Boolean(token);
  const needLogin = Boolean(to.meta?.requiresAuth);

  const routerAction: RouterAction[] = [
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
    const [flag, callback] = item;
    if (flag) {
      callback();
    }
    return flag;
  });
}
