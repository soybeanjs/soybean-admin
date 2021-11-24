<template>
  <header class="flex-y-center justify-between h-78px px-24px bg-light dark:bg-dark shadow-sm">
    <div class="flex-y-center h-full">
      <system-logo class="w-48px h-48px mr-12px" :color="theme.themeColor" />
      <n-gradient-text size="32">Soybean 网址导航</n-gradient-text>
    </div>
    <theme-switch :dark="theme.darkMode" @update="handleDarkMode" />
  </header>
</template>

<script setup lang="ts">
import { NGradientText } from 'naive-ui';
import { SystemLogo, ThemeSwitch } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { handleDarkMode } = useThemeStore();
</script>
<style scoped></style>
