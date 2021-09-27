import { defineStore } from 'pinia';
import { nextTick } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { store } from '@/store';
import { router, ROUTE_HOME } from '@/router';

/** app状态 */
interface AppState {
  menu: MenuState;
  multiTab: MultiTab;
  /** 重新加载标记 */
  reloadFlag: boolean;
  settingDrawer: SettingDrawer;
}

/** 菜单状态 */
interface MenuState {
  /** 菜单折叠 */
  collapsed: boolean;
  /** 混合菜单vertical-mix是否固定二级菜单 */
  fixedMix: boolean;
}

type MultiTabRoute = Partial<RouteLocationNormalizedLoaded> & {
  path: string;
  fullPath: string;
};

/** 多页签 */
interface MultiTab {
  routes: MultiTabRoute[];
  activeRoute: string;
}

/** 项目配置抽屉的状态 */
interface SettingDrawer {
  /** 设置抽屉可见性 */
  visible: boolean;
}

const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    menu: {
      collapsed: false,
      fixedMix: false
    },
    multiTab: {
      routes: [],
      activeRoute: ''
    },
    reloadFlag: true,
    settingDrawer: {
      visible: false
    }
  }),
  getters: {
    activeMultiTabIndex(state) {
      const { routes, activeRoute } = state.multiTab;
      return routes.findIndex(v => v.fullPath === activeRoute);
    }
  },
  actions: {
    /** 折叠/展开菜单 */
    handleMenuCollapse(collapsed: boolean) {
      this.menu.collapsed = collapsed;
    },
    /** 设置混合菜单是否固定 */
    toggleFixedMixMenu() {
      this.menu.fixedMix = !this.menu.fixedMix;
    },
    /** 切换折叠/展开菜单 */
    toggleMenu() {
      this.menu.collapsed = !this.menu.collapsed;
    },
    /** 判断页签路由是否存在某个路由 */
    getIndexInTabRoutes(fullPath: string) {
      return this.multiTab.routes.findIndex(item => item.fullPath === fullPath);
    },
    /** 添加多页签的数据 */
    addMultiTab(route: RouteLocationNormalizedLoaded) {
      const { fullPath } = route;
      const isExist = this.getIndexInTabRoutes(fullPath) > -1;
      if (!isExist) {
        this.multiTab.routes.push({ ...route });
      }
    },
    /** 删除多页签的数据 */
    removeMultiTab(fullPath: string) {
      const isActive = this.multiTab.activeRoute === fullPath;
      const { routes } = this.multiTab;
      const updateRoutes = routes.filter(v => v.fullPath !== fullPath);
      this.multiTab.routes = updateRoutes;
      if (isActive) {
        const activePath = updateRoutes[updateRoutes.length - 1].fullPath;
        router.push(activePath);
        this.setActiveMultiTab(activePath);
      }
    },
    /**
     * 删除所有多页签只保留路由首页
     * @param exclude - 保留的多页签
     */
    clearMultiTab(exclude: string[] = []) {
      const remain = [ROUTE_HOME.path, ...exclude];
      const { routes } = this.multiTab;
      const updateRoutes = routes.filter(v => remain.includes(v.fullPath));
      this.multiTab.routes = updateRoutes;
      const activePath = updateRoutes[updateRoutes.length - 1].fullPath;
      router.push(activePath);
      this.setActiveMultiTab(activePath);
    },
    /** 点击单个页签tab */
    handleClickTab(fullPath: string) {
      if (this.multiTab.activeRoute !== fullPath) {
        router.push(fullPath);
        this.setActiveMultiTab(fullPath);
      }
    },
    /** 设置当前路由对应的页签为激活状态 */
    setActiveMultiTab(fullPath: string) {
      this.multiTab.activeRoute = fullPath;
    },
    /** 获取路由首页信息 */
    getHomeTabRoute(route: RouteLocationNormalizedLoaded) {
      const { name, path, meta } = ROUTE_HOME;
      const isHome = route.name === ROUTE_HOME.name;
      const home: MultiTabRoute = {
        name,
        path,
        fullPath: path,
        meta
      };
      if (isHome) {
        Object.assign(home, route);
      }
      return home;
    },
    /** 初始化多页签数据 */
    initMultiTab() {
      const { currentRoute } = router;
      const isHome = currentRoute.value.name === ROUTE_HOME.name;
      const home = this.getHomeTabRoute(currentRoute.value);
      const routes = [home];
      if (!isHome) {
        routes.push(currentRoute.value);
      }
      this.multiTab.routes = routes;
      this.setActiveMultiTab(currentRoute.value.fullPath);
    },
    /** 重新加载页面 */
    handleReload() {
      this.reloadFlag = false;
      nextTick(() => {
        this.reloadFlag = true;
      });
    },
    /** 打开配置抽屉 */
    openSettingDrawer() {
      this.settingDrawer.visible = true;
    },
    /** 关闭配置抽屉 */
    closeSettingDrawer() {
      this.settingDrawer.visible = false;
    }
  }
});

export default function useAppStore() {
  return appStore(store);
}
