<template>
  <n-drawer :show="app.settingDrawerVisible" display-directive="show" :width="330" @mask-click="app.closeSettingDrawer">
    <n-drawer-content title="主题配置" :native-scrollbar="false"></n-drawer-content>
  </n-drawer>
  <drawer-button />
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent } from 'naive-ui';
import { useAppStore } from '@/store';
import { DrawerButton } from './components';

const app = useAppStore();
</script>
<style scoped></style>
