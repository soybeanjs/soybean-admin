<template>
  <n-menu :value="activeKey" mode="horizontal" :options="menus" @update:value="handleUpdateMenu" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import { NMenu } from 'naive-ui';
import { menus } from '@/router';
import { GlobalMenuOption } from '@/interface';

const router = useRouter();
const route = useRoute();

const activeKey = computed(() => getActiveKey());

function getActiveKey() {
  return route.name as string;
}

function handleUpdateMenu(key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  router.push(menuItem.routePath);
}
</script>
<style scoped></style>
