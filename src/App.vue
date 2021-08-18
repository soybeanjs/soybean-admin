<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="app.themeOverrids">
    <naive-app>
      <router-view />
    </naive-app>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui';
import { NaiveApp } from '@/components';
import { useAppStore } from '@/store';

const app = useAppStore();
</script>
<style></style>
