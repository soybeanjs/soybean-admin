import { defineStore } from 'pinia';
import { router, ROOT_ROUTE, constantRoutes, routes as staticRoutes } from '@/router';
import { fetchUserRoutes } from '@/service';
import {
  getUserInfo,
  transformAuthRouteToMenu,
  transformAuthRoutesToVueRoutes,
  transformAuthRouteToVueRoute,
  transformAuthRoutesToSearchMenus,
  getCacheRoutes,
  filterAuthRoutesByUserPermission,
  transformRoutePathToRouteName,
  transformRouteNameToRoutePath,
  getConstantRouteNames
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
  routeHomeName: AuthRoute.RouteKey;
  /** 菜单 */
  menus: GlobalMenuOption[];
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
      const constantRouteNames = getConstantRouteNames(constantRoutes);
      routes.forEach(route => {
        const name: AuthRoute.RouteKey = (route.name || 'root') as AuthRoute.RouteKey;
        if (!constantRouteNames.includes(name)) {
          router.removeRoute(name);
        }
      });
    },
    /**
     * 处理权限路由
     * @param routes - 权限路由
     */
    handleAuthRoutes(routes: AuthRoute.Route[]) {
      this.menus = transformAuthRouteToMenu(routes);
      this.searchMenus = transformAuthRoutesToSearchMenus(routes);

      const vueRoutes = transformAuthRoutesToVueRoutes(routes);

      vueRoutes.forEach(route => {
        router.addRoute(route);
      });

      this.cacheRoutes = getCacheRoutes(vueRoutes);
    },
    /** 动态路由模式下：更新根路由的重定向 */
    handleUpdateRootRedirect(routeKey: AuthRoute.RouteKey) {
      if (routeKey === 'root' || routeKey === 'not-found-page') {
        throw Error('routeKey的值不能为root或者not-found-page');
      }
      const rootRoute: AuthRoute.Route = { ...ROOT_ROUTE, redirect: transformRouteNameToRoutePath(routeKey) };
      const rootRouteName: AuthRoute.RouteKey = 'root';
      router.removeRoute(rootRouteName);
      const rootVueRoute = transformAuthRouteToVueRoute(rootRoute)[0];
      router.addRoute(rootVueRoute);
    },
    /** 初始化动态路由 */
    async initDynamicRoute() {
      const { userId } = getUserInfo();
      const { data } = await fetchUserRoutes(userId);
      if (data) {
        this.routeHomeName = data.home;
        this.handleUpdateRootRedirect(data.home);
        this.handleAuthRoutes(data.routes);
      }
    },
    /** 初始化静态路由 */
    async initStaticRoute() {
      const auth = useAuthStore();
      const routes = filterAuthRoutesByUserPermission(staticRoutes, auth.userInfo.userRole);
      this.handleAuthRoutes(routes);
    },
    /** 初始化权限路由 */
    async initAuthRoute() {
      const { initHomeTab } = useTabStore();
      const { userId } = getUserInfo();

      if (!userId) return;

      const isDynamicRoute = this.authRouteMode === 'dynamic';
      if (isDynamicRoute) {
        await this.initDynamicRoute();
      } else {
        await this.initStaticRoute();
      }

      initHomeTab(this.routeHomeName, router);

      this.isInitAuthRoute = true;
    }
  }
});
