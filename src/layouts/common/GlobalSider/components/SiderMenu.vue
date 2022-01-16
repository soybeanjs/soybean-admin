<template>
  <n-scrollbar>
    <n-menu
      :value="activeKey"
      :collapsed="app.siderCollapse"
      :collapsed-width="theme.sider.collapsedWidth"
      :collapsed-icon-size="22"
      :options="menus"
      :expanded-keys="expandedKeys"
      :indent="18"
      @update:value="handleUpdateMenu"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </n-scrollbar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NScrollbar, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { useAppStore, useThemeStore, useRouteStore } from '@/store';
import { useRouterPush } from '@/composables';
import type { GlobalMenuOption } from '@/interface';

const route = useRoute();
const app = useAppStore();
const theme = useThemeStore();
const routeStore = useRouteStore();
const { routerPush } = useRouterPush();

const menus = computed(() => routeStore.menus as GlobalMenuOption[]);
const activeKey = computed(() => route.name as string);
const expandedKeys = ref<string[]>([]);

function getExpendedKeys() {
  const keys = menus.value.map(menu => getActiveKeysInMenus(menu)).flat();
  return keys;
}

function getActiveKeysInMenus(menu: GlobalMenuOption) {
  const keys: string[] = [];
  if (activeKey.value.includes(menu.routeName)) {
    keys.push(menu.routeName);
  }
  if (menu.children) {
    keys.push(...menu.children.map(item => getActiveKeysInMenus(item as GlobalMenuOption)).flat(1));
  }
  return keys;
}

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  routerPush(menuItem.routePath);
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

watch(
  () => route.name,
  () => {
    expandedKeys.value = getExpendedKeys();
  },
  { immediate: true }
);
</script>
<style scoped></style>
