<template>
  <hover-container class="w-40px h-full" tooltip-content="全屏" @click="toggle">
    <icon-gridicons-fullscreen-exit v-if="isFullscreen" class="text-16px" />
    <icon-gridicons-fullscreen v-else class="text-16px" />
  </hover-container>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import { HoverContainer } from '@/components';

const { isFullscreen, toggle } = useFullscreen();
</script>
<style scoped></style>
