<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui';
import { subscribeStore, useThemeStore } from '@/store';
import { useGlobalEvents } from '@/composables';

const theme = useThemeStore();

subscribeStore();
useGlobalEvents();
</script>

<style scoped></style>
