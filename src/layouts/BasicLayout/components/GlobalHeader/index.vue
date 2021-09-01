<template>
  <div class="global-header flex-y-center justify-between">
    <h2>123</h2>
    <header-item-container class="w-40px h-full" @click="openSettingDrawer">
      <icon-mdi-light-cog class="text-16px" />
    </header-item-container>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';
import { HeaderItemContainer } from './components';

const { openSettingDrawer } = useAppStore();
</script>
<style scoped>
.global-header {
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>
