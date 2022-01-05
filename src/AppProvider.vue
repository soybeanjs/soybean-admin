<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <naive-provider>
      <slot></slot>
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui';
import { NaiveProvider } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
</script>
<style scoped></style>
