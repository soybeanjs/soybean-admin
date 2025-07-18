import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useContext } from '@sa/hooks';
import type { RouteKey } from '@elegant-router/types';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

export const [provideMixMenuContext, useMixMenuContext] = useContext('MixMenu', useMixMenu);

function useMixMenu() {
  const route = useRoute();
  const routeStore = useRouteStore();
  const { selectedKey } = useMenu();
  const { routerPushByKeyWithMetaQuery } = useRouterPush();

  const allMenus = computed<App.Global.Menu[]>(() => routeStore.menus);

  const firstLevelMenus = computed<App.Global.Menu[]>(() =>
    routeStore.menus.map(menu => {
      const { children: _, ...rest } = menu;

      return rest;
    })
  );

  const activeFirstLevelMenuKey = ref('');

  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key;
  }

  function getActiveFirstLevelMenuKey() {
    const [firstLevelRouteName] = selectedKey.value.split('_');

    setActiveFirstLevelMenuKey(firstLevelRouteName);
  }

  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false;
    }

    const findItem = allMenus.value.find(item => item.key === activeFirstLevelMenuKey.value);

    return Boolean(findItem?.children?.length);
  });

  function handleSelectFirstLevelMenu(key: RouteKey) {
    setActiveFirstLevelMenuKey(key);

    if (!isActiveFirstLevelMenuHasChildren.value) {
      routerPushByKeyWithMetaQuery(key);
    }
  }

  const secondLevelMenus = computed<App.Global.Menu[]>(
    () => allMenus.value.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || []
  );

  const activeSecondLevelMenuKey = ref('');

  function setActiveSecondLevelMenuKey(key: string) {
    activeSecondLevelMenuKey.value = key;
  }

  function getActiveSecondLevelMenuKey() {
    const keys = selectedKey.value.split('_');

    if (keys.length < 2) {
      setActiveSecondLevelMenuKey('');
      return;
    }

    const [firstLevelRouteName, level2SuffixName] = keys;

    const secondLevelRouteName = `${firstLevelRouteName}_${level2SuffixName}`;

    setActiveSecondLevelMenuKey(secondLevelRouteName);
  }

  const isActiveSecondLevelMenuHasChildren = computed(() => {
    if (!activeSecondLevelMenuKey.value) {
      return false;
    }

    const findItem = secondLevelMenus.value.find(item => item.key === activeSecondLevelMenuKey.value);

    return Boolean(findItem?.children?.length);
  });

  function handleSelectSecondLevelMenu(key: RouteKey) {
    setActiveSecondLevelMenuKey(key);

    if (!isActiveSecondLevelMenuHasChildren.value) {
      routerPushByKeyWithMetaQuery(key);
    }
  }

  const childLevelMenus = computed<App.Global.Menu[]>(
    () => secondLevelMenus.value.find(menu => menu.key === activeSecondLevelMenuKey.value)?.children || []
  );

  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey();
    },
    { immediate: true }
  );

  return {
    firstLevelMenus,
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    isActiveFirstLevelMenuHasChildren,
    handleSelectFirstLevelMenu,
    getActiveFirstLevelMenuKey,
    secondLevelMenus,
    activeSecondLevelMenuKey,
    setActiveSecondLevelMenuKey,
    isActiveSecondLevelMenuHasChildren,
    handleSelectSecondLevelMenu,
    getActiveSecondLevelMenuKey,
    childLevelMenus
  };
}

export function useMenu() {
  const route = useRoute();

  const selectedKey = computed(() => {
    const { hideInMenu, activeMenu } = route.meta;
    const name = route.name as string;

    const routeName = (hideInMenu ? activeMenu : name) || name;

    return routeName;
  });

  return {
    selectedKey
  };
}
