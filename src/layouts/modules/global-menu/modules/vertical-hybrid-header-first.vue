<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { SimpleScrollbar } from '@sa/materials';
import { useBoolean } from '@sa/hooks';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';
import FirstLevelMenu from '../components/first-level-menu.vue';
import GlobalLogo from '../../global-logo/index.vue';

defineOptions({
  name: 'VerticalHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const {
  firstLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  getActiveFirstLevelMenuKey,
  secondLevelMenus,
  activeSecondLevelMenuKey,
  isActiveSecondLevelMenuHasChildren,
  handleSelectSecondLevelMenu,
  getActiveSecondLevelMenuKey,
  childLevelMenus,
  hasChildLevelMenus,
  activeDeepestLevelMenuKey
} = useMixMenuContext('VerticalHybridHeaderFirst');
const { selectedKey } = useMenu();

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const showDrawer = computed(() => hasChildLevelMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

function handleSelectMixMenu(key: RouteKey) {
  handleSelectSecondLevelMenu(key);

  if (isActiveSecondLevelMenuHasChildren.value) {
    setDrawerVisible(true);
  }
}

/**
 * Handle second level menu selection based on autoSelectFirstMenu setting:
 * - When disabled: Activate first second-level menu for display only, expand third-level menu if exists
 * - When enabled: Navigate to the deepest menu automatically
 */
function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  if (secondLevelMenus.value.length === 0) return;

  const secondFirstMenuKey = secondLevelMenus.value[0].routeKey;

  // Case 1: autoSelectFirstMenu disabled - only activate menu for display
  if (!themeStore.sider.autoSelectFirstMenu) {
    // Check if there are third-level menus
    const hasChildren = secondLevelMenus.value.find(menu => menu.key === secondFirstMenuKey)?.children?.length;

    // If there are third-level menus, expand them
    if (hasChildren) {
      handleSelectMixMenu(secondFirstMenuKey);
    }
    return;
  }

  // Case 2: autoSelectFirstMenu enabled - navigate to deepest menu
  activeDeepestLevelMenuKey();
  setDrawerVisible(false);
}

function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
    getActiveSecondLevelMenuKey();
  }
}

const expandedKeys = ref<string[]>([]);

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="activeFirstLevelMenuKey"
      :options="firstLevelMenus"
      :indent="18"
      responsive
      @update:value="handleSelectMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menus="secondLevelMenus"
        :active-menu-key="activeSecondLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{
          width: appStore.mixSiderFixed && hasChildLevelMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px'
        }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
        >
          <header class="flex-y-center justify-between px-12px" :style="{ height: themeStore.header.height + 'px' }">
            <h2 class="text-16px text-primary font-bold">{{ $t('system.title') }}</h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <SimpleScrollbar>
            <NMenu
              v-model:expanded-keys="expandedKeys"
              mode="vertical"
              :value="selectedKey"
              :options="childLevelMenus"
              :inverted="inverted"
              :indent="18"
              @update:value="routerPushByKeyWithMetaQuery"
            />
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
