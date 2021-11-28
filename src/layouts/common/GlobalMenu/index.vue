<template>
  <div>
    <n-menu
      :value="activeKey"
      :collapsed="app.menu.collapsed"
      :collapsed-width="theme.menuStyle.collapsedWidth"
      :collapsed-icon-size="22"
      :options="menus"
      :expanded-keys="expandedKeys"
      :indent="18"
      @update:value="handleUpdateMenu"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { menus } from '@/router';
import { GlobalMenuOption } from '@/interface';

const theme = useThemeStore();
const app = useAppStore();
const router = useRouter();
const route = useRoute();

const activeKey = computed(() => route.name as string);
const expandedKeys = ref<string[]>(getExpendedKeys());

function getExpendedKeys() {
  const keys = menus.map(menu => getActiveKeysInMenus(menu)).flat();
  return keys;
}

function getActiveKeysInMenus(menu: GlobalMenuOption) {
  const keys: string[] = [];
  if (activeKey.value.includes(menu.routeName)) {
    keys.push(menu.routeName);
  }
  if (menu.children) {
    keys.push(...menu.children.map(item => getActiveKeysInMenus(item as GlobalMenuOption)).flat());
  }
  return keys;
}

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  router.push(menuItem.routePath);
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

watch(
  () => route.name,
  () => {
    expandedKeys.value = getExpendedKeys();
  }
);
</script>
<style scoped></style>
