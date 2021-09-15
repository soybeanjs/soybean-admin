<template>
  <header-item class="w-40px h-full" @click="openSettingDrawer">
    <icon-mdi-light-cog class="text-16px" />
  </header-item>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';
import HeaderItem from './HeaderItem.vue';

const { openSettingDrawer } = useAppStore();
</script>
<style scoped></style>
