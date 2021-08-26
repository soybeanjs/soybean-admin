<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme" :theme-overrides="app.themeOverrids">
    <naive-app>
      <router-view />
    </naive-app>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, darkTheme, zhCN, dateZhCN } from 'naive-ui';
import { computed } from 'vue';
import { NaiveApp } from '@/components';
import { useAppStore } from '@/store';

const app = useAppStore();
const theme = computed(() => (app.themeSettings.darkMode ? darkTheme : undefined));
</script>
<style></style>
