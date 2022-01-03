import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { useBoolean } from '@/hooks';
import { fetchUserRoutes } from '@/service';
import { findAuthRouteByKey } from '@/utils';

/** 路由状态 */
interface RouteStore {
  /** 动态路由 */
  routes: Ref<AuthRoute.Route[]>;
  /** 设置动态路由数据 */
  setRoutes(data: AuthRoute.Route[]): void;
  /** 是否添加过动态路由 */
  isAddedDynamicRoute: Ref<boolean>;
  /** 初始化动态路由 */
  initDynamicRoute(router: Router): Promise<void>;
  /** 获取路由名称(优先使用) */
  getRouteName(key: AuthRoute.RouteKey): AuthRoute.RouteKey;
  /** 获取路由路径 */
  getRoutePath(key: AuthRoute.RouteKey): AuthRoute.RoutePath<''> | undefined;
  /** 获取路由路径 */
  getRouteTitle(key: AuthRoute.RouteKey): string | undefined;
}

export const useRouteStore = defineStore('route-store', () => {
  const routes = ref<AuthRoute.Route[]>([]);
  function setRoutes(data: AuthRoute.Route[]) {
    routes.value = data;
  }

  const { bool: isAddedDynamicRoute, setTrue: setAddedDynamicRoute } = useBoolean();
  async function initDynamicRoute(router: Router) {
    const routes = await fetchUserRoutes();
    routes.forEach(route => {
      router.addRoute(route);
    });
    setAddedDynamicRoute();
  }

  function getRouteName(key: AuthRoute.RouteKey) {
    return key;
  }
  function getRoutePath(key: AuthRoute.RouteKey) {
    const allRoutes = [...constantRoutes, ...routes.value];
    const item = findAuthRouteByKey(key, allRoutes);
    return item?.path;
  }
  function getRouteTitle(key: AuthRoute.RouteKey) {
    const allRoutes = [...constantRoutes, ...routes.value];
    const item = findAuthRouteByKey(key, allRoutes);
    return item?.meta?.title;
  }

  const routeStore: RouteStore = {
    routes,
    setRoutes,
    isAddedDynamicRoute,
    initDynamicRoute,
    getRouteName,
    getRoutePath,
    getRouteTitle
  };

  return routeStore;
});
