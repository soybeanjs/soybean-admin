<template>
  <n-divider title-placement="center">深色主题</n-divider>
  <div class="flex-center">
    <n-switch :value="theme.darkMode" @update:value="handleDarkMode">
      <template #checked>
        <icon-mdi-white-balance-sunny class="text-14px text-primary" />
      </template>
      <template #unchecked>
        <icon-mdi-moon-waning-crescent class="text-14px text-primary" />
      </template>
    </n-switch>
  </div>
</template>

<script lang="ts" setup>
import { NDivider, NSwitch } from 'naive-ui';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { handleDarkMode } = useThemeStore();
</script>
<style scoped>
:deep(.n-switch__rail) {
  background-color: #000e1c !important;
}
</style>
