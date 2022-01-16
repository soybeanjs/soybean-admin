<template>
  <hover-container class="w-40px" content-class="hover:text-primary" tooltip-content="主题模式">
    <dark-mode-switch :dark="theme.darkMode" class="wh-full" @update:dark="theme.setDarkMode" />
  </hover-container>
</template>

<script lang="ts" setup>
import { HoverContainer, DarkModeSwitch } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
</script>
<style scoped></style>
