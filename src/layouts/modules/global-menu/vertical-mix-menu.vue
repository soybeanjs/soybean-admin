<script setup lang="ts">
import { computed } from 'vue';
import { useBoolean } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import { useMixMenu } from '../../hooks';
import FirstLevelMenu from './first-level-menu.vue';
import BaseMenu from './base-menu.vue';

defineOptions({
  name: 'VerticalMixMenu'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const { activeFirstLevelMenuKey, setActiveFirstLevelMenuKey, getActiveFirstLevelMenuKey } = useMixMenu();

const siderInverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const menus = computed(() => routeStore.menus.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || []);

const showDrawer = computed(() => (drawerVisible.value && menus.value.length) || appStore.mixSiderFixed);

function handleSelectMixMenu(menu: App.Global.Menu) {
  setActiveFirstLevelMenuKey(menu.key);

  if (menu.children?.length) {
    setDrawerVisible(true);
  } else {
    routerPushByKey(menu.routeKey);
  }
}

function handleResetActiveMenu() {
  getActiveFirstLevelMenuKey();
  setDrawerVisible(false);
}
</script>

<template>
  <div class="h-full flex" @mouseleave="handleResetActiveMenu">
    <FirstLevelMenu :active-menu-key="activeFirstLevelMenuKey" :inverted="siderInverted" @select="handleSelectMixMenu">
      <slot></slot>
    </FirstLevelMenu>
    <div
      class="relative h-full transition-width-300"
      :style="{ width: appStore.mixSiderFixed ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
    >
      <DarkModeContainer
        class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
        :inverted="siderInverted"
        :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
      >
        <header class="flex-y-center justify-between" :style="{ height: themeStore.header.height + 'px' }">
          <h2 class="pl-8px text-16px text-primary font-bold">{{ $t('system.title') }}</h2>
          <PinToggler
            :pin="appStore.mixSiderFixed"
            :class="{ 'text-white:88 !hover:text-white': siderInverted }"
            @click="appStore.toggleMixSiderFixed"
          />
        </header>
        <BaseMenu :dark-theme="siderInverted" :menus="menus" />
      </DarkModeContainer>
    </div>
  </div>
</template>

<style scoped></style>
