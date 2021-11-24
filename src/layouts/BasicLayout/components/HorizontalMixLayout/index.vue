<template>
  <n-layout :native-scrollbar="false" :content-style="flexColumnStyle" class="h-full">
    <n-layout-header :inverted="headerInverted" position="absolute" class="z-13">
      <global-header :show-logo="true" :show-menu-collape="true" :show-menu="false" class="relative z-2" />
    </n-layout-header>
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
        <space-placeholder :remove-tab="true" />
        <n-scrollbar class="flex-1-hidden">
          <global-menu />
        </n-scrollbar>
      </n-layout-sider>
      <n-layout-content ref="scrollbar" :native-scrollbar="false" :content-style="scrollbarContentStyle">
        <global-tab
          v-if="theme.multiTabStyle.visible"
          class="absolute left-0 w-full z-11 bg-white dark:bg-dark transition-background-color duration-300 ease-in-out"
          :style="{ top: headerHeight }"
        />
        <space-placeholder />
        <global-content />
        <global-footer />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutSider, NLayoutHeader, NScrollbar } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useLayoutConfig } from '@/composables';
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, GlobalMenu, SpacePlaceholder } from '@/layouts/common';

const theme = useThemeStore();
const app = useAppStore();
const { handleMenuCollapse } = useAppStore();
const {
  headerInverted,
  siderInverted,
  siderMenuWidth,
  globalSiderClassAndStyle,
  flexColumnStyle,
  scrollbarContentStyle,
  headerHeight,
  scrollbar
} = useLayoutConfig();
</script>
<style scoped></style>
