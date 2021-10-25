<template>
  <hover-container class="px-12px" :show-tooltip="false">
    <n-switch :value="theme.darkMode" @update:value="handleDarkMode">
      <template #checked>
        <icon-mdi-white-balance-sunny class="text-14px g_text-primary" />
      </template>
      <template #unchecked>
        <icon-mdi-moon-waning-crescent class="text-14px g_text-primary" />
      </template>
    </n-switch>
  </hover-container>
</template>

<script lang="ts" setup>
import { NSwitch } from 'naive-ui';
import { HoverContainer } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { handleDarkMode } = useThemeStore();
</script>
<style scoped>
:deep(.n-switch__rail) {
  background-color: #000e1c !important;
}
</style>
