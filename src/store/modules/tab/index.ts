import { computed, ref } from 'vue';
import type { RouteLocationNormalized, Router } from 'vue-router';
import { reloadPage, excludePageCache, includePageCache } from 'ubean/client';
import { defineStore } from 'pinia';
import { isTabbableRoute } from '@/shared/tab';
import { toAppRouteMeta } from '@/utils/route-meta';
import { getLocalJson, setLocalJson } from '@/utils/storage';
import type { AppTab } from '@/typings/app';

/** 页签 store（v3 §5.4 多页签） 详见 docs/v3-notes.md N-117。 */

const TABS_STORAGE_KEY = 'tabs';

/** `addTab` 真正读取的路由切片 详见 docs/v3-notes.md N-118。 */
export interface TabRouteLike {
  /** `RouteRecordName`（string | symbol）—— 调用点传守卫的 `to` 或测试字面量均可 */
  name?: string | symbol;
  fullPath: string;
  meta: RouteLocationNormalized['meta'];
}

export const useTabStore = defineStore('tab', () => {
  const tabs = ref<AppTab[]>(getLocalJson<AppTab[]>(TABS_STORAGE_KEY) ?? []);
  /** 当前激活页签 value */
  const activeTabValue = ref('');

  /** 固定页签（排最前，不可关闭） */
  const pinnedTabs = computed(() => tabs.value.filter(tab => tab.pinned));

  /** 非固定页签 */
  const unpinnedTabs = computed(() => tabs.value.filter(tab => !tab.pinned));

  const isEmpty = computed(() => tabs.value.length === 0);

  /** 持久化（localStorage） */
  function persist(): void {
    setLocalJson(TABS_STORAGE_KEY, tabs.value);
  }

  /** 恢复路由的 keep-alive 资格（重新打开页签时） */
  function restoreCache(routeName: string): void {
    includePageCache(routeName);
  }

  /** 页签全关后驱逐对应缓存（还有其他同路由页签——如 multiTab——则保留） */
  function evictCacheIfNeeded(routeName: string): void {
    const stillOpen = tabs.value.some(tab => tab.routeName === routeName);

    if (!stillOpen) excludePageCache(routeName);
  }

  // ------------------------------------------------------------------
  // 页签生命周期
  // ------------------------------------------------------------------

  /** 守卫 afterEach 调用：把目标路由加为页签并激活（RouteMeta 已全局扩展为
   * AppRouteMeta，`to.meta` 直接访问扩展字段，无需断言） */
  function addTab(to: TabRouteLike): void {
    const name = String(to.name ?? '');
    if (!name || name === 'NotFound') return;

    // 一次收窄成 AppRouteMeta：下面的字段访问都拿到精确类型，
    // 而不用 `RouteMeta` 的全量 unknown 索引签名（见 `@/utils/route-meta`）
    const meta = toAppRouteMeta(to.meta);

    // 空白布局（登录 / 403 / 404 / 500）不渲染后台壳，也就没有页签栏可挂 ——
    // 不拦会让它们变成「点了跳到空白页」的假页签（判定见 `@/shared/tab`）
    if (!isTabbableRoute(meta)) return;

    const value = meta.multiTab ? to.fullPath : name;

    if (!tabs.value.some(tab => tab.value === value)) {
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
        const firstUnpinned = tabs.value.findIndex(item => !item.pinned);
        if (firstUnpinned < 0) tabs.value.push(tab);
        else tabs.value.splice(firstUnpinned, 0, tab);
      } else {
        tabs.value.push(tab);
      }

      // 缓存路由：启动期已 include；若此前被页签关闭驱逐过，这里恢复资格
      if (meta.cache) restoreCache(name);
    }

    activeTabValue.value = value;
    persist();
  }

  /** 关页签：非固定才可关；关的是激活页签时跳到相邻页签 */
  function removeTab(value: string): string | null {
    const index = tabs.value.findIndex(tab => tab.value === value);
    const target = tabs.value[index];

    if (index < 0 || !target || target.pinned) return null;

    tabs.value.splice(index, 1);
    evictCacheIfNeeded(target.routeName);

    // 关的是激活页签 → 激活相邻（优先右侧，其次左侧）
    let next: AppTab | undefined;

    if (activeTabValue.value === value) {
      next = tabs.value[index] ?? tabs.value[index - 1];
      if (next) activeTabValue.value = next.value;
    }

    persist();
    return next ? next.value : null;
  }

  /** 关左侧/右侧/其他页签（保留固定页签） */
  function removeTabs(predicate: (tab: AppTab, index: number, current: AppTab) => boolean, value: string): void {
    const current = tabs.value.find(tab => tab.value === value);
    if (!current) return;

    const removed = tabs.value.filter((tab, index) => !tab.pinned && predicate(tab, index, current));

    tabs.value = tabs.value.filter(tab => tab.pinned || !removed.includes(tab));

    for (const tab of removed) {
      evictCacheIfNeeded(tab.routeName);
    }

    if (!tabs.value.some(tab => tab.value === activeTabValue.value)) {
      activeTabValue.value = value;
    }
    persist();
  }

  /** 清空非固定页签 */
  function clearTabs(): void {
    const removed = tabs.value.filter(tab => !tab.pinned);

    for (const tab of removed) {
      evictCacheIfNeeded(tab.routeName);
    }

    tabs.value = tabs.value.filter(tab => tab.pinned);
    if (!tabs.value.some(tab => tab.value === activeTabValue.value)) {
      activeTabValue.value = tabs.value[0]?.value ?? '';
    }
    persist();
  }

  /** SPageTabs 拖拽排序回调：全量回写 */
  function reorderTabs(next: AppTab[]): void {
    tabs.value = next;
    persist();
  }

  // ------------------------------------------------------------------
  // 导航
  // ------------------------------------------------------------------

  /** 点击页签跳转（`router` 由组件传入，见文件头依赖说明） */
  function switchTab(router: Router, value: string): void {
    const tab = tabs.value.find(item => item.value === value);

    if (tab) void router.push(tab.fullPath);
  }

  /** 关页签并跳转到 removeTab 返回的相邻页签 */
  function closeAndSwitch(router: Router, value: string): void {
    const next = removeTab(value);

    if (next) switchTab(router, next);
    else if (activeTabValue.value) switchTab(router, activeTabValue.value);
  }

  /** 重载当前页签（驱逐缓存重挂载，ubean `reloadPage(name)` 只重挂该页） */
  async function reloadTab(router: Router): Promise<void> {
    const tab = tabs.value.find(item => item.value === activeTabValue.value);
    const name = tab?.routeName ?? String(router.currentRoute.value.name ?? '');

    if (name) await reloadPage(name);
  }

  /** 重置（登出时调用） */
  function resetStore(): void {
    tabs.value = [];
    activeTabValue.value = '';
    setLocalJson(TABS_STORAGE_KEY, []);
  }

  return {
    tabs,
    activeTabValue,
    pinnedTabs,
    unpinnedTabs,
    isEmpty,
    addTab,
    removeTab,
    removeTabs,
    clearTabs,
    reorderTabs,
    switchTab,
    closeAndSwitch,
    reloadTab,
    evictCacheIfNeeded,
    resetStore
  };
});
