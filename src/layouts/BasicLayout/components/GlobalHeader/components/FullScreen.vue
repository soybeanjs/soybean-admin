<template>
  <header-item class="w-40px h-full" @click="toggle">
    <icon-gridicons-fullscreen-exit v-if="isFullscreen" class="text-16px" />
    <icon-gridicons-fullscreen v-else class="text-16px" />
  </header-item>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import HeaderItem from './HeaderItem.vue';

const { isFullscreen, toggle } = useFullscreen();
</script>
<style scoped></style>
