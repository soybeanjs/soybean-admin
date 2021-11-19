<template>
  <n-layout class="h-full" :native-scrollbar="false">
    <n-layout-header :inverted="headerInverted" :position="headerPosition" class="z-11">
      <global-header :show-logo="true" :show-menu-collape="false" :show-menu="true" class="relative z-2" />
      <global-tab v-if="theme.multiTabStyle.visible" />
    </n-layout-header>
    <header-placeholder />
    <n-layout-content
      :native-scrollbar="false"
      :content-style="{ height: routeProps.fullPage ? '100%' : 'auto' }"
      class="bg-[#f6f9f8] dark:bg-deep-dark"
    >
      <global-content />
    </n-layout-content>
    <global-footer />
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useRouteProps, useLayoutConfig } from '@/composables';
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, HeaderPlaceholder } from '../common';

const theme = useThemeStore();

const routeProps = useRouteProps();
const { headerInverted, headerPosition } = useLayoutConfig();
</script>
<style scoped>
.global-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
