<template>
  <hover-container class="px-12px" :show-tooltip="false">
    <div class="hover:text-primary" @click="toggleDarkMode">
      <icon-mdi-moon-waning-crescent v-if="theme.darkMode" class="text-14px" />
      <icon-mdi-white-balance-sunny v-else class="text-14px" />
    </div>
  </hover-container>
</template>

<script lang="ts" setup>
import { HoverContainer } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { toggleDarkMode } = useThemeStore();
</script>
<style scoped></style>
