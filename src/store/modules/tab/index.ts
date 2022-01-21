import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import { defineStore } from 'pinia';
import { useRouterPush } from '@/composables';
import { getTabRoutes } from '@/utils';
import type { GlobalTabRoute } from '@/interface';
import { useThemeStore } from '../theme';
import { getTabRouteByVueRoute, isInTabRoutes, getIndexInTabRoutes } from './helpers';

interface TabState {
  /** 多页签数据 */
  tabs: GlobalTabRoute[];
  /** 多页签首页 */
  homeTab: GlobalTabRoute;
  /** 当前激活状态的页签(路由path) */
  activeTab: string;
}

export const useTabStore = defineStore('tab-store', {
  state: (): TabState => ({
    tabs: [],
    homeTab: {
      name: 'root',
      path: '/',
      meta: {
        title: 'root'
      },
      scrollPosition: {
        left: 0,
        top: 0
      }
    },
    activeTab: ''
  }),
  getters: {
    /** 当前激活状态的页签索引 */
    activeTabIndex(state) {
      const { tabs, activeTab } = state;
      return tabs.findIndex(tab => tab.path === activeTab);
    }
  },
  actions: {
    /**
     * 设置当前路由对应的页签为激活状态
     * @param path - 路由path
     */
    setActiveTab(path: string) {
      this.activeTab = path;
    },
    /**
     * 初始化首页页签路由
     * @param routeHomeName - 路由首页的name
     * @param router - 路由实例
     */
    initHomeTab(routeHomeName: string, router: Router) {
      const routes = router.getRoutes();
      const findHome = routes.find(item => item.name === routeHomeName);
      if (findHome) {
        this.homeTab = getTabRouteByVueRoute(findHome);
      }
    },
    /**
     * 添加多页签
     * @param route - 路由
     */
    addTab(route: RouteLocationNormalizedLoaded) {
      if (!isInTabRoutes(this.tabs, route.path)) {
        this.tabs.push(getTabRouteByVueRoute(route));
      }
    },
    /**
     * 删除多页签
     * @param path - 路由path
     */
    removeTab(path: string) {
      const { routerPush } = useRouterPush(false);

      const isActive = this.activeTab === path;
      const updateTabs = this.tabs.filter(tab => tab.path !== path);
      this.tabs = updateTabs;
      if (isActive && updateTabs.length) {
        const activePath = updateTabs[updateTabs.length - 1].path;
        this.setActiveTab(activePath);
        routerPush(activePath);
      }
    },
    /**
     * 清空多页签(多页签首页保留)
     * @param excludes - 保留的多页签path
     */
    clearTab(excludes: string[] = []) {
      const { routerPush } = useRouterPush(false);

      const homePath = this.homeTab.path;
      const remain = [homePath, ...excludes];
      const hasActive = remain.includes(this.activeTab);
      const updateTabs = this.tabs.filter(tab => remain.includes(tab.path));
      this.tabs = updateTabs;
      if (!hasActive && updateTabs.length) {
        const activePath = updateTabs[updateTabs.length - 1].path;
        this.setActiveTab(activePath);
        routerPush(activePath);
      }
    },
    /**
     * 清除左边多页签
     * @param path - 路由path
     */
    clearLeftTab(path: string) {
      const index = getIndexInTabRoutes(this.tabs, path);
      if (index > -1) {
        const excludes = this.tabs.slice(index).map(item => item.path);
        this.clearTab(excludes);
      }
    },
    /**
     * 清除右边多页签
     * @param path - 路由path
     */
    clearRightTab(path: string) {
      const index = getIndexInTabRoutes(this.tabs, path);
      if (index > -1) {
        const excludes = this.tabs.slice(0, index + 1).map(item => item.path);
        this.clearTab(excludes);
      }
    },
    /**
     * 点击单个tab
     * @param path - 路由path
     */
    handleClickTab(path: string) {
      const { routerPush } = useRouterPush(false);

      const isActive = this.activeTab === path;
      if (!isActive) {
        this.setActiveTab(path);
        routerPush(path);
      }
    },
    /**
     * 记录tab滚动位置
     * @param path - 路由path
     * @param position - tab当前页的滚动位置
     */
    recordTabScrollPosition(path: string, position: { left: number; top: number }) {
      const index = getIndexInTabRoutes(this.tabs, path);
      if (index > -1) {
        this.tabs[index].scrollPosition = position;
      }
    },
    /**
     * 获取tab滚动位置
     * @param path - 路由path
     */
    getTabScrollPosition(path: string) {
      const position = {
        left: 0,
        top: 0
      };
      const index = getIndexInTabRoutes(this.tabs, path);
      if (index > -1) {
        Object.assign(position, this.tabs[index].scrollPosition);
      }
      return position;
    },
    /** 初始化Tab状态 */
    iniTabStore(currentRoute: RouteLocationNormalizedLoaded) {
      const theme = useThemeStore();

      const isHome = currentRoute.path === this.homeTab.path;
      const tabs: GlobalTabRoute[] = theme.tab.isCache ? getTabRoutes() : [];
      const hasHome = isInTabRoutes(tabs, this.homeTab.path);
      const hasCurrent = isInTabRoutes(tabs, currentRoute.path);
      if (!hasHome) {
        tabs.unshift(this.homeTab);
      }
      if (!isHome && !hasCurrent) {
        tabs.push(getTabRouteByVueRoute(currentRoute));
      }
      this.tabs = tabs;
      this.setActiveTab(currentRoute.path);
    }
  }
});
