<template>
  <hover-container class="w-40px h-full" @click="app.toggleSiderCollapse">
    <icon-line-md-menu-unfold-left v-if="app.siderCollapse" class="text-16px" />
    <icon-line-md-menu-fold-left v-else class="text-16px" />
  </hover-container>
</template>

<script lang="ts" setup>
import { HoverContainer } from '@/components';
import { useAppStore } from '@/store';

const app = useAppStore();
</script>
<style scoped></style>
