<template>
  <n-layout-sider
    :style="{ zIndex }"
    :native-scrollbar="false"
    :inverted="inverted"
    collapse-mode="width"
    :collapsed="app.menu.collapsed"
    :collapsed-width="theme.menuStyle.collapsedWidth"
    :width="menuWidth"
    @collapse="handleMenuCollapse(true)"
    @expand="handleMenuCollapse(false)"
  >
    <global-logo v-if="theme.isVerticalNav" />
    <n-menu
      :value="activeKey"
      :collapsed="app.menu.collapsed"
      :collapsed-width="theme.menuStyle.collapsedWidth"
      :collapsed-icon-size="22"
      :options="menus"
      @update:value="handleUpdateMenu"
    />
  </n-layout-sider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NMenu, NLayoutSider } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { menus } from '@/router';
import { GlobalMenuOption } from '@/interface';
import { GlobalLogo } from '../../../common';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const theme = useThemeStore();
const app = useAppStore();
const router = useRouter();
const route = useRoute();
const { handleMenuCollapse } = useAppStore();

const inverted = computed(() => {
  return theme.navStyle.theme !== 'light';
});

const menuWidth = computed(() => {
  const { collapsed } = app.menu;
  const { mode } = theme.navStyle;
  const { collapsedWidth, width, mixWidth } = theme.menuStyle;
  const modeWidth = mode === 'vertical-mix' ? mixWidth : width;
  return collapsed ? collapsedWidth : modeWidth;
});

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
