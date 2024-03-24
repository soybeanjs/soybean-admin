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

/**
 * create route guard
 *
 * @param router router instance
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

    const routeSwitches: CommonType.StrategicPattern[] = [
      // if it is login route when logged in, then switch to the root page
      {
        condition: isLogin && to.name === loginRoute,
        callback: () => {
          next({ name: rootRoute });
        }
      },
      // if is is constant route, then it is allowed to access directly
      {
        condition: !needLogin,
        callback: () => {
          handleRouteSwitch(to, from, next);
        }
      },
      // if the route need login but the user is not logged in, then switch to the login page
      {
        condition: !isLogin && needLogin,
        callback: () => {
          next({ name: loginRoute, query: { redirect: to.fullPath } });
        }
      },
      // if the user is logged in and has authorization, then it is allowed to access
      {
        condition: isLogin && needLogin && hasAuth,
        callback: () => {
          handleRouteSwitch(to, from, next);
        }
      },
      // if the user is logged in but does not have authorization, then switch to the 403 page
      {
        condition: isLogin && needLogin && !hasAuth,
        callback: () => {
          next({ name: noAuthorizationRoute });
        }
      }
    ];

    routeSwitches.some(({ condition, callback }) => {
      if (condition) {
        callback();
      }

      return condition;
    });
  });
}

/**
 * initialize route
 *
 * @param to to route
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const routeStore = useRouteStore();

  const notFoundRoute: RouteKey = 'not-found';
  const isNotFoundRoute = to.name === notFoundRoute;

  // if the constant route is not initialized, then initialize the constant route
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute();

    // the route is captured by the "not-found" route because the constant route is not initialized
    // after the constant route is initialized, redirect to the original route
    if (isNotFoundRoute) {
      const path = to.fullPath;

      const location: RouteLocationRaw = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash
      };

      return location;
    }
  }

  // if the route is the constant route but is not the "not-found" route, then it is allowed to access.
  if (to.meta.constant && !isNotFoundRoute) {
    return null;
  }

  // the auth route is initialized
  // it is not the "not-found" route, then it is allowed to access
  if (routeStore.isInitAuthRoute && !isNotFoundRoute) {
    return null;
  }
  // it is captured by the "not-found" route, then check whether the route exists
  if (routeStore.isInitAuthRoute && isNotFoundRoute) {
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

  // if the auth route is not initialized, then initialize the auth route
  const isLogin = Boolean(localStg.get('token'));
  // initialize the auth route requires the user to be logged in, if not, redirect to the login page
  if (!isLogin) {
    const loginRoute: RouteKey = 'login';
    const redirect = to.fullPath;

    const query: LocationQueryRaw = to.name !== loginRoute ? { redirect } : {};

    const location: RouteLocationRaw = {
      name: loginRoute,
      query
    };

    return location;
  }

  // initialize the auth route
  await routeStore.initAuthRoute();

  // the route is captured by the "not-found" route because the auth route is not initialized
  // after the auth route is initialized, redirect to the original route
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

  return null;
}

function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // route with href
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');

    next({ path: from.fullPath, replace: true, query: from.query, hash: to.hash });

    return;
  }

  next();
}
