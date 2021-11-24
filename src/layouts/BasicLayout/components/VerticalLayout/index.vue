<template>
  <n-layout :has-sider="true" class="h-full">
    <n-layout-sider
      v-bind="globalSiderClassAndStyle"
      :content-style="flexColumnStyle"
      :inverted="siderInverted"
      collapse-mode="width"
      :collapsed="app.menu.collapsed"
      :collapsed-width="theme.menuStyle.collapsedWidth"
      :width="siderMenuWidth"
      :native-scrollbar="false"
      @collapse="handleMenuCollapse(true)"
      @expand="handleMenuCollapse(false)"
    >
      <global-logo :show-title="!app.menu.collapsed" />
      <n-scrollbar class="flex-1-hidden">
        <global-menu />
      </n-scrollbar>
    </n-layout-sider>
    <n-layout-content ref="scrollbar" :native-scrollbar="false" :content-style="scrollbarContentStyle">
      <n-layout-header
        :inverted="headerInverted"
        :position="headerPosition"
        :class="{ 'z-11': theme.fixedHeaderAndTab }"
      >
        <global-header :show-logo="false" :show-menu-collape="true" :show-menu="false" class="relative z-2" />
        <global-tab v-if="theme.multiTabStyle.visible" />
      </n-layout-header>
      <space-placeholder />
      <global-content />
      <global-footer />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NLayoutContent, NLayoutHeader, NScrollbar } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useLayoutConfig } from '@/composables';
import {
  GlobalHeader,
  GlobalContent,
  GlobalFooter,
  GlobalTab,
  SpacePlaceholder,
  GlobalLogo,
  GlobalMenu
} from '@/layouts/common';

const theme = useThemeStore();
const app = useAppStore();
const { handleMenuCollapse } = useAppStore();
const {
  siderInverted,
  siderMenuWidth,
  headerInverted,
  headerPosition,
  globalSiderClassAndStyle,
  flexColumnStyle,
  scrollbarContentStyle,
  scrollbar
} = useLayoutConfig();
</script>
<style scoped></style>
