<template>
  <dark-mode-container class="global-sider flex-col-stretch h-full">
    <global-logo :show-title="!app.siderCollapse" :style="{ height: theme.header.height + 'px' }" />
    <sider-menu class="flex-1-hidden" />
  </dark-mode-container>
</template>

<script setup lang="ts">
import { DarkModeContainer } from '@/components';
import { useAppStore, useThemeStore } from '@/store';
import GlobalLogo from '../GlobalLogo/index.vue';
import { SiderMenu } from './components';

const app = useAppStore();
const theme = useThemeStore();
</script>
<style scoped>
.global-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
