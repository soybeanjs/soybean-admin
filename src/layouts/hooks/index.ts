import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouteStore } from '@/store/modules/route';

export function useMixMenu() {
  const route = useRoute();
  const routeStore = useRouteStore();

  const activeFirstLevelMenuKey = ref('');

  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key;
  }

  function getActiveFirstLevelMenuKey() {
    const { hideInMenu, activeMenu } = route.meta;
    const name = route.name as string;

    const routeName = (hideInMenu ? activeMenu : name) || name;

    const [firstLevelRouteName] = routeName.split('_');

    setActiveFirstLevelMenuKey(firstLevelRouteName);
  }

  const menus = computed(
    () => routeStore.menus.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || []
  );

  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey();
    },
    { immediate: true }
  );

  return {
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    getActiveFirstLevelMenuKey,
    menus
  };
}
