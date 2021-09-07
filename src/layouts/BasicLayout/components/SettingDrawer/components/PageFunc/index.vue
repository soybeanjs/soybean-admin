<template>
  <n-divider title-placement="center">界面功能</n-divider>
  <n-space vertical size="large">
    <div class="flex-y-center justify-between">
      <span>分割菜单</span>
      <n-switch :value="app.themeSettings.menuStyle.splitMenu" @update:value="handleSplitMenu" />
    </div>
    <div class="flex-y-center justify-between">
      <span>固定头部</span>
      <n-switch :value="app.themeSettings.headerStyle.fixed" @update:value="handleFixedHeader" />
    </div>
  </n-space>
</template>

<script lang="ts" setup>
import { NDivider, NSpace, NSwitch } from 'naive-ui';
import { useAppStore } from '@/store';

const app = useAppStore();
const { handleSplitMenu, handleFixedHeader } = useAppStore();
</script>
<style scoped></style>
