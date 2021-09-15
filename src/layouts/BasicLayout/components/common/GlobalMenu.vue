<template>
  <n-menu
    :value="activeKey"
    :collapsed="app.menu.collapsed"
    :collapsed-width="theme.menuStyle.collapsedWidth"
    :collapsed-icon-size="22"
    :options="menus"
    @update:value="handleUpdateMenu"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
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

const activeKey = computed(() => getActiveKey());

function getActiveKey() {
  return route.name as string;
}

function handleUpdateMenu(key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  router.push(menuItem.routePath);
}
</script>
<style scoped></style>
