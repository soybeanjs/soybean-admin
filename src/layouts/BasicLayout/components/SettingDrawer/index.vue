<template>
  <n-drawer v-model:show="app.settingDrawer.visible">
    <n-drawer-content title="主题配置">
      <dark-mode />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { NDrawer, NDrawerContent } from 'naive-ui';
import { useAppStore } from '@/store';
import { DarkMode } from './components';

const app = useAppStore();
</script>
<style scoped></style>
