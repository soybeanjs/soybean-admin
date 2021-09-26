<template>
  <div class="flex-center h-36px border-t-1px border-[#eee] cursor-pointer" @click="toggleMenu">
    <icon-ph-caret-double-right-bold v-if="app.menu.collapsed" class="text-16px" />
    <icon-ph:caret-double-left-bold v-else class="text-16px" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';

const app = useAppStore();
const { toggleMenu } = useAppStore();
</script>
<style scoped></style>
