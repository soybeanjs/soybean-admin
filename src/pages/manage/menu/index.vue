<script setup lang="ts">
import ManageMenu from '@/views/manage/menu/index.vue';

/**
 * 菜单管理页壳（P3-03）。
 */
definePage({
  meta: {
    title: '菜单管理',
    i18nKey: 'route.manageMenu',
    icon: 'mdi:menu',
    order: 13
  }
});
</script>

<template>
  <ManageMenu />
</template>
