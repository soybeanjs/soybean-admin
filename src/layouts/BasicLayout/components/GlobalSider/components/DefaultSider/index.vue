<template>
  <n-layout-sider
    :style="{ zIndex }"
    :inverted="inverted"
    collapse-mode="width"
    :collapsed="app.menu.collapsed"
    :collapsed-width="theme.menuStyle.collapsedWidth"
    :width="menuWidth"
    show-trigger="bar"
    @collapse="handleMenuCollapse(true)"
    @expand="handleMenuCollapse(false)"
  >
    <div class="flex-col-stretch h-full">
      <global-logo v-if="theme.isVerticalNav" />
      <n-scrollbar class="flex-1-hidden">
        <n-menu
          :value="activeKey"
          :collapsed="app.menu.collapsed"
          :collapsed-width="theme.menuStyle.collapsedWidth"
          :collapsed-icon-size="22"
          :options="menus"
          :expanded-keys="expandedKeys"
          @update:value="handleUpdateMenu"
          @update:expanded-keys="handleUpdateExpandedKeys"
        />
      </n-scrollbar>
    </div>
  </n-layout-sider>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NLayoutSider, NScrollbar, NMenu } from 'naive-ui';
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

const activeKey = computed(() => route.name as string);
const expandedKeys = ref<string[]>(getExpendedKeys());

function getExpendedKeys() {
  const keys: string[] = [];
  route.matched.forEach(item => {
    if (item.children && item.children.length) {
      keys.push(item.name as string);
    }
  });
  return keys;
}

function handleUpdateMenu(key: string, item: MenuOption) {
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
