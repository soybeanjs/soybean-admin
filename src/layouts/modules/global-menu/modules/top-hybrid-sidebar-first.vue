<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import FirstLevelMenu from '../components/first-level-menu.vue';
import { useMenu, useMixMenuContext } from '../context';

defineOptions({
  name: 'TopHybridSidebarFirst'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { firstLevelMenus, secondLevelMenus, activeFirstLevelMenuKey, handleSelectFirstLevelMenu } =
  useMixMenuContext('TopHybridSidebarFirst');
const { selectedKey } = useMenu();
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="selectedKey"
      :options="secondLevelMenus"
      :indent="18"
      responsive
      @update:value="routerPushByKeyWithMetaQuery"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full pt-2">
      <FirstLevelMenu
        :menus="firstLevelMenus"
        :active-menu-key="activeFirstLevelMenuKey"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectFirstLevelMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      />
    </div>
  </Teleport>
</template>

<style scoped></style>
