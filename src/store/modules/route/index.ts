import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { useBoolean } from '@/hooks';
import { fetchUserRoutes } from '@/service';
import { transformAuthRouteToMenu, transformAuthRouteToVueRoute } from '@/utils';
import type { GlobalMenuOption } from '@/interface';

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
}

export const useRouteStore = defineStore('route-store', () => {
  const routes = ref<AuthRoute.Route[]>([]);
  function setRoutes(data: AuthRoute.Route[]) {
    routes.value = data;
  }

  const menus = ref<GlobalMenuOption[]>([]) as Ref<GlobalMenuOption[]>;
  function getMenus(data: AuthRoute.Route[]) {
    const transform = transformAuthRouteToMenu(data);
    menus.value = transform;
  }

  const { bool: isAddedDynamicRoute, setTrue: setAddedDynamicRoute } = useBoolean();
  async function initDynamicRoute(router: Router) {
    const { data } = await fetchUserRoutes();
    if (data) {
      getMenus(data.routes);

      const vueRoutes = data.routes.map(route => transformAuthRouteToVueRoute(route));
      vueRoutes.forEach(route => {
        router.addRoute(route);
      });

      setAddedDynamicRoute();
    }
  }

  const routeStore: RouteStore = {
    routes,
    setRoutes,
    isAddedDynamicRoute,
    initDynamicRoute
  };

  return routeStore;
});
