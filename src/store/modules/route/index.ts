import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { fetchUserRoutes } from '@/service';
import { transformAuthRouteToMenu, transformAuthRoutesToVueRoutes } from '@/utils';
import type { GlobalMenuOption } from '@/interface';

interface RouteState {
  /** 是否添加过动态路由 */
  isAddedDynamicRoute: boolean;
  /** 菜单 */
  menus: GlobalMenuOption[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isAddedDynamicRoute: false,
    menus: []
  }),
  actions: {
    /**
     * 初始化动态路由
     * @param router - 路由实例
     */
    async initDynamicRoute(router: Router) {
      const { data } = await fetchUserRoutes();
      if (data) {
        this.menus = transformAuthRouteToMenu(data.routes);

        const vueRoutes = transformAuthRoutesToVueRoutes(data.routes);
        vueRoutes.forEach(route => {
          router.addRoute(route);
        });

        this.isAddedDynamicRoute = true;
      }
    }
  }
});
