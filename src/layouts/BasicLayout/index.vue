<template>
  <n-layout class="h-full" has-sider>
    <global-sider v-if="theme.isVerticalNav" :z-index="13" />
    <global-header v-if="isHorizontalMix" :z-index="14" />
    <div class="flex-1-hidden flex h-full">
      <global-sider v-if="isHorizontalMix" :z-index="13" />
      <n-scrollbar class="h-full" :content-class="routeProps.fullPage ? 'h-full' : ''">
        <div
          class="inline-flex-col-stretch w-full"
          :class="[{ 'content-padding': isHorizontalMix }, routeProps.fullPage ? 'h-full' : 'min-h-100vh']"
        >
          <global-header v-if="!isHorizontalMix" :z-index="12" />
          <global-tab v-if="theme.multiTabStyle.visible" :z-index="11" />
          <global-content />
          <global-footer />
        </div>
      </n-scrollbar>
    </div>
    <setting-drawer />
  </n-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayout, NScrollbar } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useRouteProps } from '@/composables';
import { GlobalSider, GlobalHeader, GlobalTab, GlobalContent, GlobalFooter, SettingDrawer } from './components';

const theme = useThemeStore();
const routeProps = useRouteProps();

const isHorizontalMix = computed(() => theme.navStyle.mode === 'horizontal-mix');

const headerAndMultiTabHeight = computed(() => {
  const {
    headerStyle: { height: hHeight },
    multiTabStyle: { height: mHeight }
  } = theme;
  return `${hHeight + mHeight}px`;
});
</script>
<style scoped>
:deep(.n-scrollbar-rail) {
  z-index: 11;
}

.content-padding {
  padding-top: v-bind(headerAndMultiTabHeight);
}
</style>
