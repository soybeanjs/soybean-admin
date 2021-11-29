import type { Component } from 'vue';
import type { Router, RouteRecordRaw, RouteMeta } from 'vue-router';
import type { ImportedRouteModules, LoginModuleType } from '@/interface';

interface SingleRouteConfig {
  /** 路由 */
  route: RouteRecordRaw;
  /** 路由容器 */
  container: Component;
  /** 路由容器的描述 */
  containerMeta: RouteMeta;
  /** 404路由的名称 */
  notFoundName: string;
}

/** 设置单个路由 */
export function setSingleRoute(config: SingleRouteConfig) {
  const { route, container, containerMeta, notFoundName } = config;
  const routeItem: RouteRecordRaw = {
    name: `${route.name as string}_`,
    path: `${route.path}_`,
    component: container,
    redirect: { name: notFoundName },
    meta: {
      notAsMenu: true,
      ...containerMeta,
      title: `${containerMeta.title}-container`
    },
    children: [route]
  };

  return routeItem;
}

/** 处理导入的路由模块 */
export function transformRouteModules(routeModules: ImportedRouteModules) {
  const modules = Object.keys(routeModules).map(key => {
    return routeModules[key].default;
  });
  const constantRoutes: RouteRecordRaw[] = modules.sort(
    (next, pre) => Number(next.meta?.order) - Number(pre.meta?.order)
  );
  return constantRoutes;
}

/**
 * 获取路由的首页
 * @param routes - 路由
 * @param routeHomeName - 路由首页名称
 */
export function getRouteHome(routes: RouteRecordRaw[], routeHomeName: string) {
  let routeHome: RouteRecordRaw;
  function hasChildren(route: RouteRecordRaw) {
    return Boolean(route.children && route.children.length);
  }
  function getRouteHomeByRoute(route: RouteRecordRaw) {
    if (routeHome) return;
    const hasChild = hasChildren(route);
    if (!hasChild) {
      if (route.name === routeHomeName) {
        routeHome = route;
      }
    } else {
      getRouteHomeByRoutes(route.children as RouteRecordRaw[]);
    }
  }
  function getRouteHomeByRoutes(_routes: RouteRecordRaw[]) {
    _routes.some(item => {
      getRouteHomeByRoute(item as RouteRecordRaw);
      return routeHome !== undefined;
    });
  }
  getRouteHomeByRoutes(routes);
  return routeHome!;
}

/**
 * 将多层级路由转换成二级路由
 * @param routes - 路由
 */
export function transformMultiDegreeRoutes(routes: RouteRecordRaw[]) {
  function hasComponent(route: RouteRecordRaw) {
    return Boolean(route.component);
  }
  function hasChildren(route: RouteRecordRaw) {
    return Boolean(route.children && route.children.length);
  }

  function upDimension(route: RouteRecordRaw): RouteRecordRaw[] {
    if (hasChildren(route)) {
      const updateRoute = { ...route };
      if (!hasComponent(route)) {
        return updateRoute.children!;
      }
      updateRoute.children = updateRoute.children?.map(item => upDimension(item)).flat();
      return [updateRoute];
    }
    return [route];
  }

  return routes.map(item => upDimension(item)).flat();
}

/** 获取登录后的重定向地址 */
export function getLoginRedirectUrl(router: Router) {
  const path = router.currentRoute.value.fullPath as string;
  const redirectUrl = path === '/' ? undefined : path;
  return redirectUrl;
}

/** 获取登录模块的正则字符串 */
export function getLoginModuleRegExp() {
  const modules: LoginModuleType[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];
  return modules.join('|');
}
