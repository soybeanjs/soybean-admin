<template>
  <soybean-admin-layout
    :mode="mode"
    :min-width="theme.layout.minWidth"
    :fixed-header-and-tab="theme.fixedHeaderAndTab"
    :header-height="theme.header.height"
    :tab-visible="theme.tab.visible"
    :tab-height="theme.tab.height"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :sider-collapse="app.siderCollapse"
    :fixed-footer="theme.footer.fixed"
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
  </soybean-admin-layout>
  <setting-drawer />
</template>

<script setup lang="ts">
import SoybeanAdminLayout from 'soybean-admin-layout';
import { useAppStore, useThemeStore } from '@/store';
import { useBasicLayout } from '@/composables';
import { SettingDrawer, GlobalHeader, GlobalTab, GlobalSider, GlobalContent, GlobalFooter } from '../common';

const app = useAppStore();
const theme = useThemeStore();

const { mode, headerProps, siderVisible, siderWidth, siderCollapsedWidth } = useBasicLayout();
</script>
<style scoped></style>
