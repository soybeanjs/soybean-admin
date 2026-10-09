<script setup lang="ts">
import MultiMenuSecond from '@/views/multi-menu/first/second/index.vue';

/** 多级菜单演示 · 二级（P3-10）：`menuParent` 指回上一级路由名。 */
definePage({
  meta: {
    title: '二级菜单',
    i18nKey: 'route.multiMenuSecond',
    icon: 'mdi:menu',
    order: 28,
    menuParent: 'MultiMenuFirstIndex'
  }
});
</script>

<template>
  <MultiMenuSecond />
</template>
