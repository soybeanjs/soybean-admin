import type { Component } from 'vue';
import type { Router } from 'vue-router';
import type { CustomRoute, ImportedRouteModules, CustomRouteMeta } from '@/interface';

/** 处理导入的路由模块 */
export function transformRouteModules(routeModules: ImportedRouteModules) {
  const modules = Object.keys(routeModules).map(key => {
    return routeModules[key].default;
  });
  const constantRoutes: CustomRoute[] = modules.sort((next, pre) => Number(next.meta.order) - Number(pre.meta.order));
  return constantRoutes;
}

/**
 * 获取路由的首页
 * @param routes - 路由
 * @param routeHomeName - 路由首页名称
 */
export function getRouteHome(routes: CustomRoute[], routeHomeName: string) {
  let routeHome: CustomRoute;
  function hasChildren(route: CustomRoute) {
    return Boolean(route.children && route.children.length);
  }
  function getRouteHomeByRoute(route: CustomRoute) {
    if (routeHome) return;
    const hasChild = hasChildren(route);
    if (!hasChild) {
      if (route.name === routeHomeName) {
        routeHome = route;
      }
    } else {
      getRouteHomeByRoutes(route.children as CustomRoute[]);
    }
  }
  function getRouteHomeByRoutes(_routes: CustomRoute[]) {
    _routes.some(item => {
      getRouteHomeByRoute(item as CustomRoute);
      return routeHome !== undefined;
    });
  }
  getRouteHomeByRoutes(routes);
  return routeHome!;
}

/** 获取登录后的重定向地址 */
export function getLoginRedirectUrl(router: Router) {
  const path = router.currentRoute.value.fullPath as string;
  const redirectUrl = path === '/' ? undefined : path;
  return redirectUrl;
}

interface SingleRouteConfig {
  /** 路由 */
  route: CustomRoute;
  /** 路由容器 */
  container: Component;
  /** 路由容器的描述 */
  meta: CustomRouteMeta;
  /** 404路由的名称 */
  notFoundName: string;
}
/** * 设置单个路由 */
export function setSingleRoute(config: SingleRouteConfig) {
  const { route, container, meta, notFoundName } = config;
  const routeItem: CustomRoute = {
    name: `${route.name as string}_`,
    path: `${route.path}_`,
    component: container,
    redirect: { name: notFoundName },
    meta: {
      ...meta,
      isNotMenu: true
    },
    children: [route]
  };

  return routeItem;
}
