<template>
  <n-layout :native-scrollbar="false" :content-style="scrollbarContentStyle" class="h-full">
    <n-layout-header :inverted="headerInverted" :position="headerPosition" :class="{ 'z-11': theme.fixedHeaderAndTab }">
      <global-header :show-logo="true" :show-menu-collape="false" :show-menu="true" class="relative z-2" />
      <global-tab v-if="theme.multiTabStyle.visible" />
    </n-layout-header>
    <space-placeholder />
    <n-layout-content ref="scrollbar" class="flex-1" :native-scrollbar="false" :content-style="scrollbarContentStyle">
      <global-content />
      <global-footer />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useLayoutConfig } from '@/composables';
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, SpacePlaceholder } from '../common';

const theme = useThemeStore();
const { headerInverted, headerPosition, scrollbarContentStyle, scrollbar } = useLayoutConfig();
</script>
<style scoped>
.global-sider {
  box-shadow: var(--global-sider-shadow);
}
</style>
