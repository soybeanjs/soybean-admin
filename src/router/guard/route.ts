import type { LocationQueryRaw, RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';
import type { RouteKey, RoutePath } from '@elegant-router/types';
import { useAuthStore } from '@/store/modules/auth';
import { useRouteStore } from '@/store/modules/route';
import { useFormDirtyStore } from '@/store/modules/form-dirty';
import { localStg } from '@/utils/storage';
import { getRouteName } from '@/router/elegant/transform';
import { $t } from '@/locales';

let routerInstance: Router | null = null;

export function setRouterInstance(router: Router) {
  routerInstance = router;
}

async function showFormDirtyConfirm(): Promise<boolean> {
  return new Promise(resolve => {
    window.$dialog?.warning({
      title: $t('common.formDirtyLeaveTitle'),
      content: $t('common.formDirtyLeaveContent'),
      positiveText: $t('common.formDirtyLeaveConfirm'),
      negativeText: $t('common.formDirtyLeaveCancel'),
      closable: false,
      maskClosable: false,
      onPositiveClick: () => {
        const formDirtyStore = useFormDirtyStore();
        formDirtyStore.markClean();
        resolve(true);
      },
      onNegativeClick: () => {
        resolve(false);
      },
      onClose: () => {
        resolve(false);
      }
    });
  });
}

async function handleFormDirtyNavigation(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean | undefined> {
  const formDirtyStore = useFormDirtyStore();

  if (!formDirtyStore.isDirty) {
    return handleRouteSwitch(to, from);
  }

  if (formDirtyStore.pendingNavigation) {
    formDirtyStore.resetPendingNavigation();
    return handleRouteSwitch(to, from);
  }

  const confirmed = await showFormDirtyConfirm();

  if (confirmed) {
    formDirtyStore.setPendingNavigation(to, from);
    return to.fullPath;
  }

  return false;
}

export function createRouteGuard(router: Router) {
  setRouterInstance(router);

  router.beforeEach(async (to, from) => {
    const location = await initRoute(to);

    if (location) {
      return location;
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

    if (to.name === loginRoute && isLogin) {
      return handleFormDirtyNavigation(to, from);
    }

    if (!needLogin) {
      return handleFormDirtyNavigation(to, from);
    }

    if (!isLogin) {
      return { name: loginRoute, query: { redirect: to.fullPath } };
    }

    if (!hasAuth) {
      return { name: noAuthorizationRoute };
    }

    return handleFormDirtyNavigation(to, from);
  });
}

async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const routeStore = useRouteStore();

  const notFoundRoute: RouteKey = 'not-found';
  const isNotFoundRoute = to.name === notFoundRoute;

  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute();

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
    if (to.meta.constant && !isNotFoundRoute) {
      routeStore.onRouteSwitchWhenNotLoggedIn();

      return null;
    }

    const loginRoute: RouteKey = 'login';
    const query = getRouteQueryOfLoginRoute(to, routeStore.routeHome);

    const location: RouteLocationRaw = {
      name: loginRoute,
      query
    };

    return location;
  }

  if (!routeStore.isInitAuthRoute) {
    await routeStore.initAuthRoute();

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

  if (!isNotFoundRoute) {
    return null;
  }

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

function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');

    return { path: from.fullPath, replace: true, query: from.query, hash: to.hash };
  }
}

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
