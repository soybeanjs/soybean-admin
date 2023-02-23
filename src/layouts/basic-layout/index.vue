<template>
  <admin-layout
    :mode="mode"
    :is-mobile="isMobile"
    :fixed-header-and-tab="theme.fixedHeaderAndTab"
    :header-height="theme.header.height"
    :tab-visible="theme.tab.visible"
    :tab-height="theme.tab.height"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :sider-collapse="app.siderCollapse"
    :fixed-footer="theme.footer.fixed"
    :footer-visible="theme.footer.visible"
    @update:sider-collapse="app.setSiderCollapse"
  >
    <template #header>
      <global-header v-bind="headerProps" />
    </template>
    <template #tab>
      <global-tab />
    </template>
    <template #sider>
      <global-sider />
    </template>
    <global-content />
    <template #footer>
      <global-footer />
    </template>
  </admin-layout>
  <global-back-top />
  <setting-drawer />
</template>

<script setup lang="ts">
import AdminLayout from '@soybeanjs/vue-admin-layout';
import { useAppStore, useThemeStore } from '@/store';
import { useBasicLayout } from '@/composables';
import {
  GlobalBackTop,
  GlobalContent,
  GlobalFooter,
  GlobalHeader,
  GlobalSider,
  GlobalTab,
  SettingDrawer
} from '../common';

defineOptions({ name: 'BasicLayout' });

const app = useAppStore();
const theme = useThemeStore();

const { mode, isMobile, headerProps, siderVisible, siderWidth, siderCollapsedWidth } = useBasicLayout();
</script>

<style scoped></style>
