<template>
  <n-layout-sider
    class="global-sider h-full"
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
    <global-menu />
  </n-layout-sider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayoutSider } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { GlobalLogo, GlobalMenu } from '../common';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const theme = useThemeStore();
const app = useAppStore();
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
</script>
<style scoped>
.global-sider {
  transition: all 0.2s ease-in-out;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
