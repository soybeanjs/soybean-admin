<template>
  <header v-if="fixedHeader && theme.navStyle.mode !== 'horizontal-mix'" class="w-full header-height"></header>
  <n-layout-header :inverted="headerInverted" :position="position" :style="{ zIndex }">
    <div class="global-header header-height flex-y-center w-full">
      <div v-if="!theme.isVerticalNav" class="menu-width h-full">
        <global-logo />
      </div>
      <div class="flex-1 flex justify-end h-full">
        <header-item class="w-40px h-full" @click="toggle">
          <icon-gridicons-fullscreen-exit v-if="isFullscreen" class="text-16px" />
          <icon-gridicons-fullscreen v-else class="text-16px" />
        </header-item>
        <header-item class="w-40px h-full" @click="openSettingDrawer">
          <icon-mdi-light-cog class="text-16px" />
        </header-item>
      </div>
    </div>
  </n-layout-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayoutHeader } from 'naive-ui';
import { useFullscreen } from '@vueuse/core';
import { useAppStore, useThemeStore } from '@/store';
import { HeaderItem } from './components';
import { GlobalLogo } from '../common';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const { openSettingDrawer } = useAppStore();
const theme = useThemeStore();
const { isFullscreen, toggle } = useFullscreen();

const inverted = computed(() => {
  return theme.navStyle.theme !== 'light';
});
const fixedHeader = computed(() => theme.headerStyle.fixed || theme.navStyle.mode === 'horizontal-mix');
const position = computed(() => (fixedHeader.value ? 'absolute' : 'static'));
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
