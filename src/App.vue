<template>
  <n-config-provider :theme-overrides="theme.naiveThemeOverrides">
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { NConfigProvider } from 'naive-ui';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { addThemeCssVarsToRoot } = useThemeStore();

onMounted(() => {
  addThemeCssVarsToRoot();
});
</script>
<style scoped></style>
