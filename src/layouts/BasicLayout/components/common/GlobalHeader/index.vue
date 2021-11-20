<template>
  <div class="global-header flex-y-center w-full" :style="{ height: headerHeight }">
    <global-logo v-if="showLogo" :show-title="true" class="h-full" :style="{ width: theme.menuStyle.width + 'px' }" />
    <div v-if="!showMenu" class="flex-1-hidden flex-y-center h-full">
      <menu-collapse v-if="showMenuCollape" />
      <global-breadcrumb v-if="theme.crumbsStyle.visible" />
    </div>
    <div
      v-else
      class="flex-1-hidden flex-y-center h-full"
      :style="{ justifyContent: theme.menuStyle.horizontalPosition }"
    >
      <header-menu />
    </div>
    <div class="flex justify-end h-full">
      <github-site />
      <full-screen />
      <theme-mode />
      <user-avatar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { useLayoutConfig } from '@/composables';
import {
  HeaderMenu,
  GlobalBreadcrumb,
  UserAvatar,
  MenuCollapse,
  ThemeMode,
  FullScreen,
  GithubSite
} from './components';
import GlobalLogo from '../GlobalLogo/index.vue';

interface Props {
  /** 显示logo */
  showLogo: boolean;
  /** 显示菜单折叠按钮 */
  showMenuCollape: boolean;
  /** 显示菜单 */
  showMenu: boolean;
}

defineProps<Props>();

const theme = useThemeStore();
const { headerHeight } = useLayoutConfig();
</script>
<style scoped>
.global-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
