<template>
  <dark-mode-container class="flex h-full" :inverted="theme.sider.inverted" @mouseleave="resetFirstDegreeMenus">
    <div class="flex-1 flex-col-stretch h-full">
      <global-logo :show-title="false" :style="{ height: theme.header.height + 'px' }" />
      <n-scrollbar class="flex-1-hidden">
        <mix-menu-detail
          v-for="item in firstDegreeMenus"
          :key="item.routeName"
          :route-name="item.routeName"
          :active-route-name="activeParentRouteName"
          :label="item.label"
          :icon="item.icon"
          :is-mini="app.siderCollapse"
          @click="handleMixMenu(item.routeName, item.hasChildren)"
        />
      </n-scrollbar>
      <mix-menu-collapse />
    </div>
    <mix-menu-drawer :visible="drawerVisible" :menus="activeChildMenus" />
  </dark-mode-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore, useRouteStore, useThemeStore } from '@/store';
import { useRouterPush } from '@/composables';
import { useBoolean } from '@/hooks';
import { GlobalLogo } from '@/layouts/common';
import { MixMenuCollapse, MixMenuDetail, MixMenuDrawer } from './components';

defineOptions({ name: 'VerticalMixSider' });

const route = useRoute();
const app = useAppStore();
const theme = useThemeStore();
const routeStore = useRouteStore();
const { routerPush } = useRouterPush();
const { bool: drawerVisible, setTrue: openDrawer, setFalse: hideDrawer } = useBoolean();

const activeParentRouteName = ref('');
function setActiveParentRouteName(routeName: string) {
  activeParentRouteName.value = routeName;
}

const firstDegreeMenus = computed(() =>
  routeStore.menus.map(item => {
    const { routeName, label } = item;
    const icon = item?.icon;
    const hasChildren = Boolean(item.children && item.children.length);

    return {
      routeName,
      label,
      icon,
      hasChildren
    };
  })
);

function getActiveParentRouteName() {
  firstDegreeMenus.value.some(item => {
    const routeName = (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string;
    const flag = routeName?.includes(item.routeName);
    if (flag) {
      setActiveParentRouteName(item.routeName);
    }
    return flag;
  });
}

function handleMixMenu(routeName: string, hasChildren: boolean) {
  setActiveParentRouteName(routeName);
  if (hasChildren) {
    openDrawer();
  } else {
    routerPush({ name: routeName });
  }
}

function resetFirstDegreeMenus() {
  getActiveParentRouteName();
  hideDrawer();
}

const activeChildMenus = computed(() => {
  const menus: App.GlobalMenuOption[] = [];
  routeStore.menus.some(item => {
    const flag = item.routeName === activeParentRouteName.value && Boolean(item.children?.length);
    if (flag) {
      menus.push(...(item.children || []));
    }
    return flag;
  });
  return menus;
});

watch(
  () => route.name,
  () => {
    getActiveParentRouteName();
  },
  { immediate: true }
);
</script>

<style scoped></style>
