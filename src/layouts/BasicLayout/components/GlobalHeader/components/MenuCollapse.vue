<template>
  <hover-container class="w-40px h-full" @click="toggleMenu">
    <icon-line-md-menu-unfold-left v-if="app.menu.collapsed" class="text-16px" />
    <icon-line-md-menu-fold-left v-else class="text-16px" />
  </hover-container>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';
import { HoverContainer } from '@/components';

const app = useAppStore();
const { toggleMenu } = useAppStore();
</script>
<style scoped></style>
