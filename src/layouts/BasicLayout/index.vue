<template>
  <n-layout has-sider :position="position">
    <n-layout-sider
      class="layout-sider min-h-100vh z-11"
      :native-scrollbar="false"
      :inverted="inverted"
      collapse-mode="width"
      :collapsed="app.themeSettings.menuStyle.collapsed"
      :collapsed-width="app.themeSettings.menuStyle.collapsedWidth"
      :width="menuWidth"
      @collapse="handleMenuCollapse(true)"
      @expand="handleMenuCollapse(false)"
    >
      <global-logo />
      <global-menu />
    </n-layout-sider>
    <n-layout :inverted="inverted">
      <n-layout-header :position="position" :inverted="headerInverted" class="z-10">
        <global-header class="header-height" />
      </n-layout-header>
      <n-layout-content class="main-padding flex-auto min-h-100vh">
        <router-view />
      </n-layout-content>
      <n-layout-footer></n-layout-footer>
    </n-layout>
    <setting-drawer />
  </n-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NLayoutFooter } from 'naive-ui';
import { useAppStore } from '@/store';
import { GlobalHeader, GlobalLogo, GlobalMenu, SettingDrawer } from './components';

const app = useAppStore();
const { handleMenuCollapse } = useAppStore();

const position = computed(() => (app.themeSettings.headerStyle.fixed ? 'absolute' : 'static'));
const menuWidth = computed(() => {
  const { collapsed, collapsedWidth, width } = app.themeSettings.menuStyle;
  return collapsed ? collapsedWidth : width;
});
const inverted = computed(() => {
  const { theme } = app.themeSettings.navStyle;
  return theme !== 'light';
});
const headerInverted = computed(() => {
  const { theme } = app.themeSettings.navStyle;
  return theme !== 'dark' ? inverted.value : !inverted.value;
});
const headerHeight = computed(() => {
  const { height } = app.themeSettings.headerStyle;
  return `${height}px`;
});
</script>
<style scoped>
.layout-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
.header-height {
  height: v-bind(headerHeight);
}
.main-padding {
  padding-top: v-bind(headerHeight);
}
</style>
