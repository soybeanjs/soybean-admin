<template>
  <dark-mode-container class="global-header flex-y-center h-full">
    <global-logo v-if="showLogo" :show-title="true" class="h-full" :style="{ width: theme.sider.width + 'px' }" />
    <div v-if="!showHeaderMenu" class="flex-1-hidden flex-y-center h-full">
      <menu-collapse v-if="showMenuCollape" />
      <global-breadcrumb v-if="theme.header.crumb.visible" />
    </div>
    <div v-else class="flex-1-hidden flex-y-center h-full" :style="{ justifyContent: theme.menu.horizontalPosition }">
      <header-menu />
    </div>
    <div class="flex justify-end h-full">
      <global-search />
      <github-site />
      <full-screen />
      <theme-mode />
      <user-avatar />
    </div>
  </dark-mode-container>
</template>

<script setup lang="ts">
import { DarkModeContainer } from '@/components';
import { useThemeStore } from '@/store';
import type { GlobalHeaderProps } from '@/interface';
import GlobalLogo from '../GlobalLogo/index.vue';
import GlobalSearch from '../GlobalSearch/index.vue';
import {
  MenuCollapse,
  GlobalBreadcrumb,
  HeaderMenu,
  GithubSite,
  FullScreen,
  ThemeMode,
  UserAvatar
} from './components';

interface Props {
  /** 显示logo */
  showLogo: GlobalHeaderProps['showLogo'];
  /** 显示头部菜单 */
  showHeaderMenu: GlobalHeaderProps['showHeaderMenu'];
  /** 显示菜单折叠按钮 */
  showMenuCollape: GlobalHeaderProps['showMenuCollape'];
}

defineProps<Props>();

const theme = useThemeStore();
</script>
<style scoped>
.global-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
