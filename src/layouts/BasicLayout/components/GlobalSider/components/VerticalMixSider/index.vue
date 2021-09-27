<template>
  <div class="flex h-full bg-white dark:bg-[#18181c]">
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
            v-model:hover-route="hoverRoute"
            :route-name="item.routeName"
            :label="item.label"
            :icon="item.icon"
            :is-active="activeParentRouteName === item.routeName"
            :is-mini="app.menu.collapsed"
          />
        </n-scrollbar>
      </div>
      <mix-menu-collapse />
    </div>
    <div
      class="relative h-full transition-width duration-300 ease-in-out"
      :style="{ width: app.menu.fixedMix ? theme.menuStyle.width + 'px' : '0px' }"
    >
      <mix-menu-drawer :hover-route="hoverRoute" @reset-hover-route="resetHoverRoute" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { VNodeChild } from 'vue';
import { NScrollbar } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useAppStore, useThemeStore } from '@/store';
import { menus } from '@/router';
import { MixMenu, MixMenuCollapse, MixMenuDrawer } from './components';
import { GlobalLogo } from '../../../common';

const theme = useThemeStore();
const app = useAppStore();
const route = useRoute();

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

const activeParentRouteName = computed(() => {
  let name = '';
  const { matched } = route;
  if (matched.length) {
    name = matched[0].name as string;
  }
  return name;
});

const hoverRoute = ref('');
function resetHoverRoute() {
  hoverRoute.value = '';
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
