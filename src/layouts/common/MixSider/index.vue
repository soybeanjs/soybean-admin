<template>
  <div class="flex h-full bg-white dark:bg-[#18181c]" @mouseleave="handleMouseLeaveMenu">
    <div
      class="flex-col-stretch flex-1 h-full transition-width duration-300 ease-in-out"
      :class="[app.menu.collapsed ? 'mix-menu_collapsed-width' : 'mix-menu_width']"
    >
      <global-logo :show-title="false" />
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
            @click="handleMixMenu(item.routeName, item.isSingle)"
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
import { useRouter, useRoute } from 'vue-router';
import { useAppStore, useThemeStore } from '@/store';
import { menus } from '@/router';
import { routeNameWatcher } from '@/composables';
import { useBoolean } from '@/hooks';
import { MixMenu, MixMenuCollapse, MixMenuDrawer } from './components';
import GlobalLogo from '../GlobalLogo/index.vue';

const theme = useThemeStore();
const app = useAppStore();
const router = useRouter();
const route = useRoute();
const { bool: drawerVisible, setTrue: openDrawer, setFalse: hideDrawer } = useBoolean();

const mixMenuWidth = computed(() => `${theme.menuStyle.mixWidth}px`);
const mixMenuCollapsedWidth = computed(() => `${theme.menuStyle.mixCollapsedWidth}px`);

const firstDegreeMenus = menus.map(item => {
  const { routeName } = item;
  const label = item.label as string;
  const icon = item.icon! as () => VNodeChild;
  const isSingle = !(item.children && item.children.length);

  return {
    routeName,
    label,
    icon,
    isSingle
  };
});

const activeParentRouteName = ref(getActiveRouteName());

function getActiveRouteName() {
  let name = '';
  const menuMatched = route.matched.filter(item => !item.meta?.notAsMenu);
  if (menuMatched.length) {
    name = menuMatched[0].name as string;
  }
  return name;
}

function handleMixMenu(routeName: string, isSingle: boolean) {
  activeParentRouteName.value = routeName;
  if (isSingle) {
    router.push({ name: routeName });
  } else {
    openDrawer();
  }
}

function handleMouseLeaveMenu() {
  activeParentRouteName.value = getActiveRouteName();
  hideDrawer();
}

routeNameWatcher(() => {
  activeParentRouteName.value = getActiveRouteName();
});
</script>
<style scoped>
.mix-menu_width {
  width: v-bind(mixMenuWidth);
}
.mix-menu_collapsed-width {
  width: v-bind(mixMenuCollapsedWidth);
}
</style>
