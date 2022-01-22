import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { routeName } from '@/router';
import { useRouteStore } from '@/store';
import { getToken } from '@/utils';

/**
 * 动态路由
 */
export async function createDynamicRouteGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  const route = useRouteStore();
  const isLogin = Boolean(getToken());

  // 初始化动态路由
  if (!route.isAddedDynamicRoute) {
    // 未登录情况下直接回到登录页，登录成功后再加载动态路由
    if (!isLogin) {
      if (to.name === routeName('login')) {
        next();
      } else {
        const redirect = to.fullPath;
        next({ name: routeName('login'), query: { redirect } });
      }
      return false;
    }

    await route.initDynamicRoute(router);

    if (to.name === routeName('not-found-page')) {
      // 动态路由没有加载导致被not-found-page路由捕获，等待动态路由加载好了，回到之前的路由
      next({ path: to.fullPath, replace: true, query: to.query });
      return false;
    }
    // 动态路由已经加载，仍然未找到，重定向到not-found
    if (to.name === routeName('not-found-page')) {
      next({ name: routeName('not-found'), replace: true });
      return false;
    }
  }

  return true;
}
