import type {
  LocationQueryRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router
} from 'vue-router';
import type { RouteKey, RoutePath } from '@elegant-router/types';
import { useAuthStore } from '@/store/modules/auth';
import { useRouteStore } from '@/store/modules/route';
import { localStg } from '@/utils/storage';
import { getRouteName } from '@/router/elegant/transform';

/**
 * 创建路由守卫
 *
 * @param router 路由实例
 */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const location = await initRoute(to);

    if (location) {
      next(location);
      return;
    }

    const authStore = useAuthStore();

    const rootRoute: RouteKey = 'root';
    const loginRoute: RouteKey = 'login';
    const noAuthorizationRoute: RouteKey = '403';

    const isLogin = Boolean(localStg.get('token'));
    const needLogin = !to.meta.constant;
    const routeRoles = to.meta.roles || [];

    const hasRole = authStore.userInfo.roles.some(role => routeRoles.includes(role));
    const hasAuth = authStore.isStaticSuper || !routeRoles.length || hasRole;

    // 已登录时访问登录页，跳转到首页
    if (to.name === loginRoute && isLogin) {
      next({ name: rootRoute });
      return;
    }

    // 路由不需要登录，直接放行
    if (!needLogin) {
      handleRouteSwitch(to, from, next);
      return;
    }

    // 路由需要登录但用户未登录，跳转到登录页
    if (!isLogin) {
      next({ name: loginRoute, query: { redirect: to.fullPath } });
      return;
    }

    // 已登录但无权限，跳转到 403 页面
    if (!hasAuth) {
      next({ name: noAuthorizationRoute });
      return;
    }

    // 正常切换路由
    handleRouteSwitch(to, from, next);
  });
}

/**
 * 初始化路由
 *
 * @param to 目标路由
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const routeStore = useRouteStore();

  const notFoundRoute: RouteKey = 'not-found';
  const isNotFoundRoute = to.name === notFoundRoute;

  // 如果常量路由未初始化，则初始化常量路由
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute();

    // 因为常量路由未初始化，被 not-found 路由捕获
    // 常量路由初始化后，重定向到原始路由
    const path = to.fullPath;
    const location: RouteLocationRaw = {
      path,
      replace: true,
      query: to.query,
      hash: to.hash
    };

    return location;
  }

  const isLogin = Boolean(localStg.get('token'));

  if (!isLogin) {
    // 未登录且为常量路由但不是 not-found 路由，允许访问
    if (to.meta.constant && !isNotFoundRoute) {
      routeStore.onRouteSwitchWhenNotLoggedIn();

      return null;
    }

    // 未登录，跳转到登录页
    const loginRoute: RouteKey = 'login';
    const query = getRouteQueryOfLoginRoute(to, routeStore.routeHome);

    const location: RouteLocationRaw = {
      name: loginRoute,
      query
    };

    return location;
  }

  if (!routeStore.isInitAuthRoute) {
    // 初始化权限路由
    await routeStore.initAuthRoute();

    // 因为权限路由未初始化，被 not-found 路由捕获
    // 权限路由初始化后，重定向到原始路由
    if (isNotFoundRoute) {
      const rootRoute: RouteKey = 'root';
      const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath;

      const location: RouteLocationRaw = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash
      };

      return location;
    }
  }

  routeStore.onRouteSwitchWhenLoggedIn();

  // 权限路由已初始化，且不是 not-found 路由，允许访问
  if (!isNotFoundRoute) {
    return null;
  }

  // 被 not-found 路由捕获，判断路由是否存在
  const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath);
  const noPermissionRoute: RouteKey = '403';

  if (exist) {
    const location: RouteLocationRaw = {
      name: noPermissionRoute
    };

    return location;
  }

  return null;
}

/**
 * 处理路由切换
 */
function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // 带 href 的路由
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');

    next({ path: from.fullPath, replace: true, query: from.query, hash: to.hash });

    return;
  }

  next();
}

/**
 * 获取登录路由的 query
 */
function getRouteQueryOfLoginRoute(to: RouteLocationNormalized, routeHome: RouteKey) {
  const loginRoute: RouteKey = 'login';
  const redirect = to.fullPath;
  const [redirectPath, redirectQuery] = redirect.split('?');
  const redirectName = getRouteName(redirectPath as RoutePath);

  const isRedirectHome = routeHome === redirectName;

  const query: LocationQueryRaw = to.name !== loginRoute && !isRedirectHome ? { redirect } : {};

  if (isRedirectHome && redirectQuery) {
    query.redirect = `/?${redirectQuery}`;
  }

  return query;
}
