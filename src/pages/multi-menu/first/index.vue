<script setup lang="ts">
import MultiMenuFirst from '@/views/multi-menu/first/index.vue';

/** 多级菜单演示 · 二级（P3-10）：`menuParent` 指回一级路由名。 */
definePage({
  meta: {
    title: '二级菜单',
    i18nKey: 'route.multiMenuFirst',
    icon: 'mdi:menu',
    order: 27,
    menuParent: 'MultiMenuIndex'
  }
});
</script>

<template>
  <MultiMenuFirst />
</template>
