<template>
  <div class="flex h-full bg-white dark:bg-[#18181c]" @mouseleave="handleMouseLeaveMenu">
    <div
      class="flex-col-stretch flex-1 h-full transition-width duration-300 ease-in-out"
      :class="[app.menu.collapsed ? 'mix-menu-collapsed-width' : 'mix-menu-width']"
    >
      <global-logo />
      <div class="flex-1-hidden">
        <n-scrollbar>
          <mix-menu
            v-for="item in firstDegreeMenus"
            :key="item.routeName"
            :route-name="item.routeName"
            :label="item.label"
            :icon="item.icon"
            :active-route-name="activeParentRouteName"
            :is-mini="app.menu.collapsed"
            @click="handleMixMenu(item.routeName)"
          />
        </n-scrollbar>
      </div>
      <mix-menu-collapse />
    </div>
    <div
      class="relative h-full transition-width duration-300 ease-in-out"
      :style="{ width: app.menu.fixedMix ? theme.menuStyle.width + 'px' : '0px' }"
    >
      <mix-menu-drawer :visible="drawerVisible" :active-route-name="activeParentRouteName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { VNodeChild } from 'vue';
import { NScrollbar } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useAppStore, useThemeStore } from '@/store';
import { menus } from '@/router';
import { MixMenu, MixMenuCollapse, MixMenuDrawer } from './components';
import { GlobalLogo } from '../../../common';
import { useBoolean } from '@/hooks';

const theme = useThemeStore();
const app = useAppStore();
const route = useRoute();
const { bool: drawerVisible, setTrue: openDrawer, setFalse: hideDrawer } = useBoolean();

const mixMenuWidth = computed(() => `${theme.menuStyle.mixWidth}px`);
const mixMenuCollapsedWidth = computed(() => `${theme.menuStyle.mixCollapsedWidth}px`);

const firstDegreeMenus = menus.map(item => {
  const { routeName } = item;
  const label = item.label as string;
  const icon = item.icon! as () => VNodeChild;
  return {
    routeName,
    label,
    icon
  };
});

const activeParentRouteName = ref(getActiveRouteName());

function getActiveRouteName() {
  let name = '';
  const { matched } = route;
  if (matched.length) {
    name = matched[0].name as string;
  }
  return name;
}

function handleMixMenu(routeName: string) {
  activeParentRouteName.value = routeName;
  openDrawer();
}

function handleMouseLeaveMenu() {
  activeParentRouteName.value = getActiveRouteName();
  hideDrawer();
}
</script>
<style scoped>
.mix-menu-width {
  width: v-bind(mixMenuWidth);
}
.mix-menu-collapsed-width {
  width: v-bind(mixMenuCollapsedWidth);
}
</style>
