<template>
  <n-drawer v-model:show="app.settingDrawer.visible" display-directive="show" :width="330">
    <n-drawer-content title="主题配置" :native-scrollbar="false">
      <dark-mode />
      <nav-mode />
      <system-theme />
      <page-func />
      <page-view />
      <theme-config />
    </n-drawer-content>
  </n-drawer>
  <drawer-button v-if="showSettingButton" />
</template>

<script lang="ts" setup>
import { NDrawer, NDrawerContent } from 'naive-ui';
import { useAppStore } from '@/store';
import { DarkMode, NavMode, SystemTheme, PageFunc, PageView, ThemeConfig, DrawerButton } from './components';

const app = useAppStore();

const showSettingButton = import.meta.env.DEV || import.meta.env.VITE_HTTP_ENV === 'STAGING';
</script>
<style scoped></style>
