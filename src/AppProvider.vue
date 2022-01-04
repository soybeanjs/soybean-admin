<template>
  <n-config-provider :theme-overrides="theme.naiveThemeOverrides">
    <slot></slot>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
</script>
<style scoped></style>
