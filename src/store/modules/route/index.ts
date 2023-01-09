import { defineStore } from 'pinia';
import { ROOT_ROUTE, constantRoutes, router, routes as staticRoutes } from '@/router';
import { fetchUserRoutes } from '@/service';
import {
  localStg,
  filterAuthRoutesByUserPermission,
  getCacheRoutes,
  getConstantRouteNames,
  transformAuthRouteToVueRoutes,
  transformAuthRouteToVueRoute,
  transformAuthRouteToMenu,
  transformAuthRouteToSearchMenus,
  transformRouteNameToRoutePath,
  transformRoutePathToRouteName,
  sortRoutes
} from '@/utils';
import { useAuthStore } from '../auth';
import { useTabStore } from '../tab';

interface RouteState {
  /**
   * 权限路由模式:
   * - static - 前端声明的静态
   * - dynamic - 后端返回的动态
   */
  authRouteMode: ImportMetaEnv['VITE_AUTH_ROUTE_MODE'];
  /** 是否初始化了权限路由 */
  isInitAuthRoute: boolean;
  /** 路由首页name(前端静态路由时生效，后端动态路由该值会被后端返回的值覆盖) */
  routeHomeName: AuthRoute.AllRouteKey;
  /** 菜单 */
  menus: App.GlobalMenuOption[];
  /** 搜索的菜单 */
  searchMenus: AuthRoute.Route[];
  /** 缓存的路由名称 */
  cacheRoutes: string[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    authRouteMode: import.meta.env.VITE_AUTH_ROUTE_MODE,
    isInitAuthRoute: false,
    routeHomeName: transformRoutePathToRouteName(import.meta.env.VITE_ROUTE_HOME_PATH),
    menus: [],
    searchMenus: [],
    cacheRoutes: []
  }),
  actions: {
    /** 重置路由的store */
    resetRouteStore() {
      this.resetRoutes();
      this.$reset();
    },
    /** 重置路由数据，保留固定路由 */
    resetRoutes() {
      const routes = router.getRoutes();
      routes.forEach(route => {
        const name = (route.name || 'root') as AuthRoute.AllRouteKey;
        if (!this.isConstantRoute(name)) {
          router.removeRoute(name);
        }
      });
    },
    /**
     * 是否是固定路由
     * @param name 路由名称
     */
    isConstantRoute(name: AuthRoute.AllRouteKey) {
      const constantRouteNames = getConstantRouteNames(constantRoutes);
      return constantRouteNames.includes(name);
    },
    /**
     * 是否是有效的固定路由
     * @param name 路由名称
     */
    isValidConstantRoute(name: AuthRoute.AllRouteKey) {
      const NOT_FOUND_PAGE_NAME: AuthRoute.NotFoundRouteKey = 'not-found';
      const constantRouteNames = getConstantRouteNames(constantRoutes);
      return constantRouteNames.includes(name) && name !== NOT_FOUND_PAGE_NAME;
    },
    /**
     * 处理权限路由
     * @param routes - 权限路由
     */
    handleAuthRoute(routes: AuthRoute.Route[]) {
      (this.menus as App.GlobalMenuOption[]) = transformAuthRouteToMenu(routes);
      this.searchMenus = transformAuthRouteToSearchMenus(routes);

      const vueRoutes = transformAuthRouteToVueRoutes(routes);

      vueRoutes.forEach(route => {
        router.addRoute(route);
      });

      this.cacheRoutes = getCacheRoutes(vueRoutes);
    },
    /** 动态路由模式下：更新根路由的重定向 */
    handleUpdateRootRedirect(routeKey: AuthRoute.AllRouteKey) {
      if (routeKey === 'root' || routeKey === 'not-found') {
        throw new Error('routeKey的值不能为root或者not-found');
      }
      const rootRoute: AuthRoute.Route = { ...ROOT_ROUTE, redirect: transformRouteNameToRoutePath(routeKey) };
      const rootRouteName: AuthRoute.AllRouteKey = 'root';
      router.removeRoute(rootRouteName);
      const rootVueRoute = transformAuthRouteToVueRoute(rootRoute)[0];
      router.addRoute(rootVueRoute);
    },
    /** 初始化动态路由 */
    async initDynamicRoute() {
      const { initHomeTab } = useTabStore();

      const { userId } = localStg.get('userInfo') || {};

      if (!userId) {
        throw new Error('userId 不能为空!');
      }

      const { error, data } = await fetchUserRoutes(userId);

      if (!error) {
        this.routeHomeName = data.home;
        this.handleUpdateRootRedirect(data.home);
        this.handleAuthRoute(sortRoutes(data.routes));

        initHomeTab(data.home, router);

        this.isInitAuthRoute = true;
      }
    },
    /** 初始化静态路由 */
    async initStaticRoute() {
      const { initHomeTab } = useTabStore();
      const auth = useAuthStore();

      const routes = filterAuthRoutesByUserPermission(staticRoutes, auth.userInfo.userRole);
      this.handleAuthRoute(routes);

      initHomeTab(this.routeHomeName, router);

      this.isInitAuthRoute = true;
    },
    /** 初始化权限路由 */
    async initAuthRoute() {
      if (this.authRouteMode === 'dynamic') {
        await this.initDynamicRoute();
      } else {
        await this.initStaticRoute();
      }
    }
  }
});
