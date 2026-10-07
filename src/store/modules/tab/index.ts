import type { RouteLocationNormalized } from 'vue-router';
import { reloadPage, excludePageCache, includePageCache } from 'ubean/client';
import { defineStore } from 'pinia';
import { getLocalJson, setLocalJson } from '@/utils/storage';
import { getRouter } from '@/router/instance';
import type { AppTab } from '@/typings/app';

/**
 * 页签 store（v3 §5.4 多页签）。
 *
 * 页签 value 约定：multiTab 页 = fullPath（同路由不同 query 独立页签），
 * 普通页 = 路由名。keep-alive：`meta.cache` 的路由由 ubean 启动期种入
 * KeepAlive（`initCachedViewsFromRoutes`），缓存开关走 ubean 全局的
 * `excludePageCache` / `includePageCache`（模块级响应式状态，PageView 的
 * `<KeepAlive :include>` 直接消费）—— 应用侧不自建缓存列表。
 *
 * 持久化：页签列表写 localStorage（`@/utils/storage` 前缀封装），刷新恢复。
 */

const TABS_STORAGE_KEY = 'tabs';

interface TabState {
  tabs: AppTab[];
  /** 当前激活页签 value */
  activeTabValue: string;
}

export const useTabStore = defineStore('tab', {
  state: (): TabState => ({
    tabs: getLocalJson<AppTab[]>(TABS_STORAGE_KEY) ?? [],
    activeTabValue: ''
  }),
  getters: {
    /** 固定页签（排最前，不可关闭） */
    pinnedTabs: state => state.tabs.filter(tab => tab.pinned),
    /** 非固定页签 */
    unpinnedTabs: state => state.tabs.filter(tab => !tab.pinned),
    isEmpty: state => state.tabs.length === 0
  },
  actions: {
    // ------------------------------------------------------------------
    // 页签生命周期
    // ------------------------------------------------------------------

    /** 守卫 afterEach 调用：把目标路由加为页签并激活（RouteMeta 已全局扩展为
     * AppRouteMeta，`to.meta` 直接访问扩展字段，无需断言） */
    addTab(to: RouteLocationNormalized) {
      const name = String(to.name ?? '');
      if (!name || name === 'NotFound') return;

      const meta = to.meta;
      const value = meta.multiTab ? to.fullPath : name;

      if (!this.tabs.some(tab => tab.value === value)) {
        const tab: AppTab = {
          value,
          label: String(meta.title ?? name),
          i18nKey: meta.i18nKey,
          icon: meta.icon,
          pinned: meta.pinned,
          routeName: name,
          fullPath: to.fullPath
        };

        // 固定页签排最前
        if (tab.pinned) {
          const firstUnpinned = this.tabs.findIndex(item => !item.pinned);
          if (firstUnpinned < 0) this.tabs.push(tab);
          else this.tabs.splice(firstUnpinned, 0, tab);
        } else {
          this.tabs.push(tab);
        }

        // 缓存路由：启动期已 include；若此前被页签关闭驱逐过，这里恢复资格
        if (meta.cache) this.restoreCache(name);
      }

      this.activeTabValue = value;
      this.persist();
    },

    /** 关页签：非固定才可关；关的是激活页签时跳到相邻页签 */
    removeTab(value: string): string | null {
      const index = this.tabs.findIndex(tab => tab.value === value);
      if (index < 0 || this.tabs[index]?.pinned) return null;

      const removed = this.tabs[index];
      this.tabs.splice(index, 1);

      if (removed) {
        this.evictCacheIfNeeded(removed.routeName);
      }

      // 关的是激活页签 → 激活相邻（优先右侧，其次左侧）
      let next: AppTab | undefined;

      if (this.activeTabValue === value) {
        next = this.tabs[index] ?? this.tabs[index - 1];
        if (next) this.activeTabValue = next.value;
      }

      this.persist();
      return next ? next.value : null;
    },

    /** 关左侧/右侧/其他页签（保留固定页签） */
    removeTabs(predicate: (tab: AppTab, index: number, current: AppTab) => boolean, value: string) {
      const current = this.tabs.find(tab => tab.value === value);
      if (!current) return;

      const removed = this.tabs.filter((tab, index) => !tab.pinned && predicate(tab, index, current));

      this.tabs = this.tabs.filter(tab => tab.pinned || !removed.includes(tab));

      for (const tab of removed) {
        this.evictCacheIfNeeded(tab.routeName);
      }

      if (!this.tabs.some(tab => tab.value === this.activeTabValue)) {
        this.activeTabValue = value;
      }
      this.persist();
    },

    /** 清空非固定页签 */
    clearTabs() {
      const removed = this.tabs.filter(tab => !tab.pinned);

      for (const tab of removed) {
        this.evictCacheIfNeeded(tab.routeName);
      }

      this.tabs = this.tabs.filter(tab => tab.pinned);
      if (!this.tabs.some(tab => tab.value === this.activeTabValue)) {
        this.activeTabValue = this.tabs[0]?.value ?? '';
      }
      this.persist();
    },

    /** SPageTabs 拖拽排序回调：全量回写 */
    reorderTabs(next: AppTab[]) {
      this.tabs = next;
      this.persist();
    },

    // ------------------------------------------------------------------
    // 导航
    // ------------------------------------------------------------------

    /** 点击页签跳转 */
    switchTab(value: string) {
      const tab = this.tabs.find(item => item.value === value);

      if (tab) void getRouter().push(tab.fullPath);
    },

    /** 关页签并跳转到 removeTab 返回的相邻页签 */
    closeAndSwitch(value: string) {
      const next = this.removeTab(value);

      if (next) this.switchTab(next);
      else if (this.activeTabValue) this.switchTab(this.activeTabValue);
    },

    /** 重载当前页签（驱逐缓存重挂载，ubean `reloadPage(name)` 只重挂该页） */
    async reloadTab() {
      const tab = this.tabs.find(item => item.value === this.activeTabValue);
      const name = tab?.routeName ?? String(getRouter().currentRoute.value.name ?? '');

      if (name) await reloadPage(name);
    },

    /** 页签全关后驱逐对应缓存（还有其他同路由页签——如 multiTab——则保留） */
    evictCacheIfNeeded(routeName: string) {
      const stillOpen = this.tabs.some(tab => tab.routeName === routeName);

      if (!stillOpen) excludePageCache(routeName);
    },

    /** 恢复路由的 keep-alive 资格（重新打开页签时） */
    restoreCache(routeName: string) {
      includePageCache(routeName);
    },

    /** 重置（登出时调用） */
    resetStore() {
      this.tabs = [];
      this.activeTabValue = '';
      setLocalJson(TABS_STORAGE_KEY, []);
    },

    /** 持久化（localStorage） */
    persist() {
      setLocalJson(TABS_STORAGE_KEY, this.tabs);
    }
  }
});
