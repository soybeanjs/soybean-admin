<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'HorizontalMenu'
});

const route = useRoute();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return routeName;
});
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="selectedKey"
      :options="routeStore.menus"
      :indent="18"
      responsive
      @update:value="routerPushByKeyWithMetaQuery"
    />
  </Teleport>
</template>

<style scoped></style>
