import { computed, ref } from 'vue';
import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { useEventListener } from '@vueuse/core';
import { SetupStoreId } from '@/enum';
import {
  getAllTabs,
  getDefaultHomeTab,
  getTabByRoute,
  isTabInTabs,
  filterTabsById,
  getFixedTabIds,
  filterTabsByIds,
  updateTabsByI18nKey,
  updateTabByI18nKey
} from './shared';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { useThemeStore } from '../theme';

export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  const themeStore = useThemeStore();
  const { routerPush } = useRouterPush(false);

  /**
   * tabs
   */
  const tabs = ref<App.Global.Tab[]>([]);

  /**
   * get active tab
   */
  const homeTab = ref<App.Global.Tab>();

  /**
   * init home tab
   * @param router router instance
   */
  function initHomeTab(router: Router) {
    homeTab.value = getDefaultHomeTab(router);
  }

  /**
   * get all tabs
   */
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value));

  /**
   * active tab id
   */
  const activeTabId = ref<string>('');

  /**
   * set active tab id
   * @param id tab id
   */
  function setActiveTabId(id: string) {
    activeTabId.value = id;
  }

  /**
   * init tab store
   * @param currentRoute current route
   */
  function initTabStore(currentRoute: App.Global.TabRoute) {
    const storageTabs = localStg.get('globalTabs');

    if (themeStore.tab.cache && storageTabs) {
      tabs.value = updateTabsByI18nKey(storageTabs);
    }

    addTab(currentRoute);
  }

  /**
   * add tab
   * @param route tab route
   * @param active whether to activate the added tab
   */
  function addTab(route: App.Global.TabRoute, active = true) {
    const tab = getTabByRoute(route);

    const isHomeTab = tab.id === homeTab.value?.id;

    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      tabs.value.push(tab);
    }

    if (active) {
      setActiveTabId(tab.id);
    }
  }

  /**
   * remove tab
   * @param tabId tab id
   */
  async function removeTab(tabId: string) {
    const isRemoveActiveTab = activeTabId.value === tabId;
    const updatedTabs = filterTabsById(tabId, tabs.value);

    function update() {
      tabs.value = updatedTabs;
    }

    if (!isRemoveActiveTab) {
      update();
      return;
    }

    const activeTab = updatedTabs.at(-1) || homeTab.value;

    if (activeTab) {
      await switchRouteByTab(activeTab);
      update();
    }
  }

  /**
   * clear tabs
   * @param excludes exclude tab ids
   */
  async function clearTabs(excludes: string[] = []) {
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes];
    const removedTabsIds = tabs.value.map(tab => tab.id).filter(id => !remainTabIds.includes(id));

    const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value);
    const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value);

    function update() {
      tabs.value = updatedTabs;
    }

    if (!isRemoveActiveTab) {
      update();
      return;
    }

    const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value;

    await switchRouteByTab(activeTab);
    update();
  }

  /**
   * switch route by tab
   * @param tab
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    const fail = await routerPush(tab.fullPath);
    if (!fail) {
      setActiveTabId(tab.id);
    }
  }

  /**
   * clear left tabs
   * @param tabId
   */
  async function clearLeftTabs(tabId: string) {
    const tabIds = tabs.value.map(tab => tab.id);
    const index = tabIds.indexOf(tabId);
    if (index === -1) return;

    const excludes = tabIds.slice(index);
    await clearTabs(excludes);
  }

  /**
   * clear right tabs
   * @param tabId
   */
  async function clearRightTabs(tabId: string) {
    const tabIds = tabs.value.map(tab => tab.id);
    const index = tabIds.indexOf(tabId);
    if (index === -1) return;

    const excludes = tabIds.slice(0, index + 1);
    await clearTabs(excludes);
  }

  /**
   * set new label of tab
   * @param label new tab label
   * @param tabId tab id
   * @default activeTabId
   */
  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || activeTabId.value;

    const tab = tabs.value.find(item => item.id === id);
    if (!tab) return;

    tab.newLabel = label;
  }

  /**
   * reset tab label
   * @param tabId tab id
   * @default activeTabId
   */
  function resetTabLabel(tabId?: string) {
    const id = tabId || activeTabId.value;

    const tab = tabs.value.find(item => item.id === id);
    if (!tab) return;

    tab.newLabel = undefined;
  }

  /**
   * is tab retain
   * @param tabId
   */
  function isTabRetain(tabId: string) {
    if (tabId === homeTab.value?.id) return true;

    const fixedTabIds = getFixedTabIds(tabs.value);

    return fixedTabIds.includes(tabId);
  }

  /**
   * update tabs by locale
   */
  function updateTabsByLocale() {
    tabs.value = updateTabsByI18nKey(tabs.value);

    if (homeTab.value) {
      homeTab.value = updateTabByI18nKey(homeTab.value);
    }
  }

  /**
   * cache tabs
   */
  function cacheTabs() {
    if (!themeStore.tab.cache) return;

    localStg.set('globalTabs', tabs.value);
  }

  // cache tabs when page is closed or refreshed
  useEventListener(window, 'beforeunload', () => {
    cacheTabs();
  });

  return {
    /**
     * all tabs
     */
    tabs: allTabs,
    activeTabId,
    initHomeTab,
    initTabStore,
    addTab,
    removeTab,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    switchRouteByTab,
    setTabLabel,
    resetTabLabel,
    isTabRetain,
    updateTabsByLocale
  };
});
