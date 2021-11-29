<template>
  <hover-container class="w-40px" content-class="hover:text-primary" tooltip-content="主题模式" @click="toggleDarkMode">
    <icon-mdi-moon-waning-crescent v-if="theme.darkMode" class="text-18px" />
    <icon-mdi-white-balance-sunny v-else class="text-18px" />
  </hover-container>
</template>

<script lang="ts" setup>
import { HoverContainer } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { toggleDarkMode } = useThemeStore();
</script>
<style scoped></style>
