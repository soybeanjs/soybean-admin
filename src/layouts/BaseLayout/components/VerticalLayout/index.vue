<template>
  <n-layout :has-sider="true" class="h-full">
    <n-layout-sider
      class="global-sider z-12"
      :inverted="inverted"
      collapse-mode="width"
      :collapsed="app.menu.collapsed"
      :collapsed-width="theme.menuStyle.collapsedWidth"
      :width="menuWidth"
      :native-scrollbar="false"
      @collapse="handleMenuCollapse(true)"
      @expand="handleMenuCollapse(false)"
    >
      <global-logo :show-title="!app.menu.collapsed" class="header-height absolute-lt w-full z-2" />
      <global-menu class="header-padding" />
    </n-layout-sider>
    <n-layout-content
      :native-scrollbar="false"
      :content-style="{ height: routeProps.fullPage ? '100%' : 'auto' }"
      class="bg-[#f6f9f8] dark:bg-deep-dark"
    >
      <n-layout-header :inverted="headerInverted" :position="headerPosition" class="z-11">
        <global-header
          :show-logo="false"
          :show-menu-collape="true"
          :show-menu="false"
          class="header-height relative z-2"
        />
        <global-tab v-if="theme.multiTabStyle.visible" class="tab-height" />
      </n-layout-header>
      <div v-if="theme.fixedHeaderAndTab" class="header-tab_height"></div>
      <global-content />
      <global-footer />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NLayout, NLayoutSider, NLayoutContent, NLayoutHeader } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useRouteProps } from '@/hooks';
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, GlobalLogo, GlobalMenu } from '../common';

const theme = useThemeStore();
const app = useAppStore();
const routeProps = useRouteProps();

const { handleMenuCollapse } = useAppStore();

const inverted = computed(() => {
  return theme.navStyle.theme !== 'light';
});

const menuWidth = computed(() => {
  const { collapsed } = app.menu;
  const { collapsedWidth, width } = theme.menuStyle;
  return collapsed ? collapsedWidth : width;
});

const headerInverted = computed(() => {
  return theme.navStyle.theme !== 'dark' ? inverted.value : !inverted.value;
});
const headerPosition = computed(() => (theme.fixedHeaderAndTab ? 'absolute' : 'static'));
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});

const tabHeight = computed(() => {
  const { height } = theme.multiTabStyle;
  return `${height}px`;
});

const headerAndTabHeight = computed(() => {
  const {
    multiTabStyle: { visible, height: tH },
    headerStyle: { height: hH }
  } = theme;
  const height = visible ? tH + hH : hH;
  return `${height}px`;
});
</script>
<style scoped>
.global-sider {
  transition: all 0.2s ease-in-out;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
.header-height {
  height: v-bind(headerHeight);
}
.header-padding {
  padding-top: v-bind(headerHeight);
}
.tab-height {
  height: v-bind(tabHeight);
}
.header-tab_height {
  height: v-bind(headerAndTabHeight);
}
</style>
