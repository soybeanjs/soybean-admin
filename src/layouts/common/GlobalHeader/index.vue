<template>
  <dark-mode-container class="global-header flex-y-center h-full" :inverted="theme.header.inverted">
    <global-logo v-if="showLogo" :show-title="true" class="h-full" :style="{ width: theme.sider.width + 'px' }" />
    <div v-if="!showHeaderMenu" class="flex-1-hidden flex-y-center h-full">
      <menu-collapse v-if="showMenuCollapse || isMobile" />
      <global-breadcrumb v-if="theme.header.crumb.visible && !isMobile" />
    </div>
    <header-menu v-else />
    <div class="flex justify-end h-full">
      <global-search />
      <github-site />
      <full-screen />
      <theme-mode />
      <system-message />
      <setting-button v-if="showButton" />
      <user-avatar />
    </div>
  </dark-mode-container>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store';
import { useBasicLayout } from '@/composables';
import GlobalLogo from '../GlobalLogo/index.vue';
import GlobalSearch from '../GlobalSearch/index.vue';
import {
  FullScreen,
  GithubSite,
  GlobalBreadcrumb,
  HeaderMenu,
  MenuCollapse,
  SettingButton,
  SystemMessage,
  ThemeMode,
  UserAvatar
} from './components';

defineOptions({ name: 'GlobalHeader' });

interface Props {
  /** 显示logo */
  showLogo: App.GlobalHeaderProps['showLogo'];
  /** 显示头部菜单 */
  showHeaderMenu: App.GlobalHeaderProps['showHeaderMenu'];
  /** 显示菜单折叠按钮 */
  showMenuCollapse: App.GlobalHeaderProps['showMenuCollapse'];
}

defineProps<Props>();

const theme = useThemeStore();
const { isMobile } = useBasicLayout();

const showButton = import.meta.env.PROD && import.meta.env.VITE_VERCEL !== 'Y';
</script>

<style scoped>
.global-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
