<template>
  <div style="flex: 1; overflow: hidden; padding: 0 10px">
    <n-scrollbar :x-scrollable="true" class="flex-1-hidden">
      <n-menu
        :value="activeKey"
        mode="horizontal"
        :options="menus"
        :inverted="theme.header.inverted"
        @update:value="handleUpdateMenu"
      />
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import { useRouteStore, useThemeStore } from '@/store';
import { useRouterPush } from '@/composables';

const route = useRoute();
const routeStore = useRouteStore();
const theme = useThemeStore();
const { routerPush } = useRouterPush();

const menus = computed(() => routeStore.menus as GlobalMenuOption[]);
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  routerPush(menuItem.routePath);
}
</script>

<style lang="scss" scoped>
:deep(.n-menu-item-content__icon) {
  font-size: 16px !important;
}
:deep(.n-menu .n-menu-item) {
  margin-top: 0;
  // margin-bottom: 5px;
}
:deep(.n-menu .n-menu-item::before) {
  left: 0;
  right: 0;
  border-radius: 3px;
  margin: 0 5px;
}
:deep(.n-menu-item-content-header) {
  overflow: inherit !important;
}
</style>
