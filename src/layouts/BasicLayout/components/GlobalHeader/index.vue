<template>
  <div class="global-header flex-y-center justify-end">
    <header-item class="w-40px h-full" @click="toggle">
      <icon-gridicons-fullscreen-exit v-if="isFullscreen" class="text-16px" />
      <icon-gridicons-fullscreen v-else class="text-16px" />
    </header-item>
    <header-item class="w-40px h-full" @click="openSettingDrawer">
      <icon-mdi-light-cog class="text-16px" />
    </header-item>
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store';
import { HeaderItem } from './components';

const { openSettingDrawer } = useAppStore();
const { isFullscreen, toggle } = useFullscreen();
</script>
<style scoped>
.global-header {
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>
