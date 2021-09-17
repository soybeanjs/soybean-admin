<template>
  <header v-if="fixedHeaderAndTab && theme.navStyle.mode !== 'horizontal-mix'" class="header-height w-full"></header>
  <n-layout-header :inverted="headerInverted" :position="position" :style="{ zIndex }">
    <div class="global-header header-height flex-y-center w-full">
      <div v-if="!theme.isVerticalNav" class="menu-width h-full">
        <global-logo />
      </div>
      <div class="flex-y-center h-full">
        <menu-collapse v-if="theme.navStyle.mode !== 'horizontal'" />
        <global-breadcrumb v-if="theme.crumbsStyle.visible" />
      </div>
      <div class="flex-1 flex justify-end h-full">
        <gihub-site />
        <full-screen />
        <user-avatar />
        <setting-drawer-button />
      </div>
    </div>
  </n-layout-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayoutHeader } from 'naive-ui';
import { useThemeStore } from '@/store';
import { GlobalBreadcrumb, UserAvatar, MenuCollapse, FullScreen, GihubSite, SettingDrawerButton } from './components';
import { GlobalLogo } from '../common';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const theme = useThemeStore();

const inverted = computed(() => {
  return theme.navStyle.theme !== 'light';
});
const fixedHeaderAndTab = computed(() => theme.fixedHeaderAndTab || theme.navStyle.mode === 'horizontal-mix');
const position = computed(() => (fixedHeaderAndTab.value ? 'absolute' : 'static'));
const headerInverted = computed(() => {
  return theme.navStyle.theme !== 'dark' ? inverted.value : !inverted.value;
});
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});
const menuWidth = computed(() => {
  const { width } = theme.menuStyle;

  return `${width}px`;
});
</script>
<style scoped>
.global-header {
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
.header-height {
  height: v-bind(headerHeight);
}
.menu-width {
  width: v-bind(menuWidth);
}
</style>
