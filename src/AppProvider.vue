<template>
  <n-config-provider
    class="h-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="naiveTheme"
    :theme-overrides="theme.themeOverrids"
  >
    <n-element class="h-full">
      <naive-provider>
        <slot></slot>
      </naive-provider>
    </n-element>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, NElement, zhCN, dateZhCN } from 'naive-ui';
import { NaiveProvider } from '@/components';
import { useThemeStore } from '@/store';
import { useDarkMode } from '@/composables';

const theme = useThemeStore();
const { naiveTheme } = useDarkMode();
</script>
<style></style>
