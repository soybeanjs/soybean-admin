import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { useBoolean } from '@/hooks';
import { fetchUserRoutes } from '@/service';
import { transformAuthRouteToMenu, transformAuthRoutesToVueRoutes } from '@/utils';
import type { GlobalMenuOption } from '@/interface';

/** 路由状态 */
interface RouteStore {
  /** 是否添加过动态路由 */
  isAddedDynamicRoute: Ref<boolean>;
  /** 初始化动态路由 */
  initDynamicRoute(router: Router): Promise<void>;
  /** 菜单 */
  menus: Ref<GlobalMenuOption[]>;
}

export const useRouteStore = defineStore('route-store', () => {
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

      const vueRoutes = transformAuthRoutesToVueRoutes(data.routes);
      vueRoutes.forEach(route => {
        router.addRoute(route);
      });

      setAddedDynamicRoute();
    }
  }

  const routeStore: RouteStore = {
    isAddedDynamicRoute,
    initDynamicRoute,
    menus
  };

  return routeStore;
});
