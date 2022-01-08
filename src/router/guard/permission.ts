import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { routeName } from '@/router';
import { useAuthStore, useRouteStore } from '@/store';
import { exeStrategyActions, getToken } from '@/utils';

/** 处理路由页面的权限 */
export async function handlePagePermission(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  const auth = useAuthStore();
  const route = useRouteStore();
  const { initDynamicRoute } = useRouteStore();

  const isLogin = Boolean(getToken());
  const permissions = to.meta.permissions || [];
  const needLogin = Boolean(to.meta?.requiresAuth) || Boolean(permissions.length);
  const hasPermission = !permissions.length || permissions.includes(auth.userInfo.userRole);

  if (!route.isAddedDynamicRoute) {
    // 添加动态路由
    await initDynamicRoute(router);

    if (to.name === routeName('not-found-page')) {
      // 动态路由没有加载导致被not-found-page路由捕获，等待动态路由加载好了，回到之前的路由
      next({ path: to.fullPath, replace: true, query: to.query });
      return;
    }
  }

  // 动态路由已经加载，仍然未找到，重定向到not-found
  if (to.name === routeName('not-found-page')) {
    next({ name: routeName('not-found'), replace: true });
    return;
  }

  const actions: Common.StrategyAction[] = [
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
        const redirect = to.fullPath;
        next({ name: routeName('login'), query: { redirect } });
      }
    ],
    // 登录状态进入需要登录权限的页面，有权限直接通行
    [
      isLogin && needLogin && hasPermission,
      () => {
        next();
      }
    ],
    [
      // 登录状态进入需要登录权限的页面，无权限，重定向到无权限页面
      isLogin && needLogin && !hasPermission,
      () => {
        next({ name: routeName('no-permission') });
      }
    ]
  ];

  exeStrategyActions(actions);
}
