<template>
  <n-drawer :show="app.settingDrawerVisible" display-directive="show" :width="330" @mask-click="app.closeSettingDrawer">
    <n-drawer-content title="主题配置" :native-scrollbar="false">
      <dark-mode />
      <layout-mode />
      <theme-color-select />
      <page-func />
      <page-view />
      <theme-config />
    </n-drawer-content>
  </n-drawer>
  <drawer-button v-if="showButton" />
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { DarkMode, DrawerButton, LayoutMode, PageFunc, PageView, ThemeColorSelect, ThemeConfig } from './components';

defineOptions({ name: 'SettingDrawer' });

const app = useAppStore();

const showButton = import.meta.env.DEV || import.meta.env.VITE_VERCEL === 'Y';
</script>

<style scoped></style>
