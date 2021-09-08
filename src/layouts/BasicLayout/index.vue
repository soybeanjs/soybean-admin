<template>
  <n-layout class="h-full" has-sider>
    <global-sider v-if="theme.isVerticalNav" :z-index="2" />
    <global-header v-if="isHorizontalMix" :z-index="2" />
    <div class="flex-1-hidden flex h-full">
      <global-sider v-if="isHorizontalMix" class="sider-margin" :z-index="1" />
      <n-scrollbar class="h-full" :x-scrollable="true">
        <div class="inline-flex-col-stretch w-full min-h-100vh" :class="{ 'content-padding': isHorizontalMix }">
          <global-header v-if="!isHorizontalMix" :z-index="1" />
          <n-layout-content class="flex-auto" :class="{ 'bg-[#f5f7f9]': !theme.darkMode }">
            <router-view />
          </n-layout-content>
          <global-footer />
        </div>
      </n-scrollbar>
    </div>
    <setting-drawer />
  </n-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayout, NScrollbar, NLayoutContent } from 'naive-ui';
import { useThemeStore } from '@/store';
import { GlobalSider, GlobalHeader, GlobalFooter, SettingDrawer } from './components';

const theme = useThemeStore();
const isHorizontalMix = computed(() => theme.navStyle.mode === 'horizontal-mix');
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});
</script>
<style scoped>
:deep(.n-scrollbar-rail) {
  z-index: 11;
}
.sider-margin {
  margin-top: v-bind(headerHeight);
}
.content-padding {
  padding-top: v-bind(headerHeight);
}
</style>
