import { nextTick } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { ScrollbarInst } from 'naive-ui';
import { defineStore } from 'pinia';
import { router, ROUTE_HOME } from '@/router';
import { store, useThemeStore } from '@/store';
import { getTabRouteStorage } from '@/utils';
import type { MultiTab, MultiTabRoute } from '@/interface';
import { getHomeTabRoute, isInTabRoutes } from './helpers';

/** app状态 */
interface AppState {
  layout: LayoutState;
  menu: MenuState;
  multiTab: MultiTab;
  /** 重新加载标记 */
  reloadFlag: boolean;
  settingDrawer: SettingDrawer;
}

/** 布局状态 */
interface LayoutState {
  scrollbar: ScrollbarInst | null;
}

/** 菜单状态 */
interface MenuState {
  /** 菜单折叠 */
  collapsed: boolean;
  /** 混合菜单vertical-mix是否固定二级菜单 */
  fixedMix: boolean;
}

/** 项目配置抽屉的状态 */
interface SettingDrawer {
  /** 设置抽屉可见性 */
  visible: boolean;
}

const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    layout: {
      scrollbar: null
    },
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
    /** 设置scrollbar的实例 */
    setScrollbarInstance(scrollbar: ScrollbarInst) {
      this.layout.scrollbar = scrollbar;
    },
    /** 重置滚动条行为 */
    resetScrollBehavior() {
      const { scrollbar } = this.layout;
      setTimeout(() => {
        scrollbar?.scrollTo({ left: 0, top: 0 });
      }, 250);
    },
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
    /** 添加多页签的数据 */
    addMultiTab(route: RouteLocationNormalizedLoaded) {
      const { fullPath } = route;
      const isExist = isInTabRoutes(this.multiTab.routes, fullPath);
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
    /** 删除左边多页签 */
    clearLeftMultiTab(fullPath: string) {
      const { routes } = this.multiTab;
      const currentIndex = routes.findIndex(route => route.fullPath === fullPath);
      const activeIndex = this.activeMultiTabIndex;
      if (currentIndex > -1) {
        const remain = [ROUTE_HOME.path, ...routes.slice(currentIndex).map(v => v.fullPath)];
        const updateRoutes = routes.filter(v => remain.includes(v.fullPath));
        this.multiTab.routes = updateRoutes;
        if (activeIndex < currentIndex) {
          const activePath = updateRoutes[updateRoutes.length - 1].fullPath;
          router.push(activePath);
          this.setActiveMultiTab(activePath);
        }
      }
    },
    /** 删除右边多页签 */
    clearRightMultiTab(fullPath: string) {
      const { routes } = this.multiTab;
      const currentIndex = routes.findIndex(route => route.fullPath === fullPath);
      const activeIndex = this.activeMultiTabIndex;
      if (currentIndex > -1) {
        const remain = [ROUTE_HOME.path, ...routes.slice(0, currentIndex + 1).map(v => v.fullPath)];
        const updateRoutes = routes.filter(v => remain.includes(v.fullPath));
        this.multiTab.routes = updateRoutes;
        if (activeIndex > currentIndex) {
          router.push(fullPath);
          this.setActiveMultiTab(fullPath);
        }
      }
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
    /** 初始化多页签数据 */
    initMultiTab() {
      const theme = useThemeStore();
      const { currentRoute } = router;
      const isHome = currentRoute.value.name === ROUTE_HOME.name;
      const home = getHomeTabRoute(currentRoute.value);
      const routes: MultiTabRoute[] = theme.multiTabStyle.isCache ? getTabRouteStorage() : [];
      const hasHome = isInTabRoutes(routes, home.fullPath);
      const hasCurrent = isInTabRoutes(routes, currentRoute.value.fullPath);
      if (!hasHome) {
        routes.unshift(home);
      }
      if (!isHome && !hasCurrent) {
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
        this.resetScrollBehavior();
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
