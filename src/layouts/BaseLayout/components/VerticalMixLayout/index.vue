<template>
  <n-layout :has-sider="true" class="h-full">
    <n-layout-sider
      class="global-sider z-12 transition-all duration-200 ease-in-out"
      :inverted="siderInverted"
      collapse-mode="width"
      :collapsed="app.menu.collapsed"
      :collapsed-width="theme.menuStyle.collapsedWidth"
      :width="siderMenuWidth"
      :native-scrollbar="false"
      @collapse="handleMenuCollapse(true)"
      @expand="handleMenuCollapse(false)"
    >
      <global-logo :show-title="!app.menu.collapsed" class="absolute-lt z-2" />
      <global-menu :style="{ paddingTop: headerHeight }" />
    </n-layout-sider>
    <n-layout-content
      :native-scrollbar="false"
      :content-style="{ height: routeProps.fullPage ? '100%' : 'auto' }"
      class="bg-[#f6f9f8] dark:bg-deep-dark"
    >
      <n-layout-header :inverted="headerInverted" :position="headerPosition" class="z-11">
        <global-header :show-logo="false" :show-menu-collape="true" :show-menu="false" class="relative z-2" />
        <global-tab v-if="theme.multiTabStyle.visible" />
      </n-layout-header>
      <div v-if="theme.fixedHeaderAndTab" :style="{ height: headerAndMultiTabHeight }"></div>
      <global-content />
      <global-footer />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NLayoutContent, NLayoutHeader } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useRouteProps, useLayoutConfig } from '@/composables';
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, GlobalLogo, GlobalMenu } from '../common';

const theme = useThemeStore();
const app = useAppStore();
const { handleMenuCollapse } = useAppStore();
const routeProps = useRouteProps();
const { siderInverted, siderMenuWidth, headerInverted, headerPosition, headerHeight, headerAndMultiTabHeight } =
  useLayoutConfig();
</script>
<style scoped>
.global-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
