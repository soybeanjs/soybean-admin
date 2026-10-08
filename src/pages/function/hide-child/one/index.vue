<script setup lang="ts">
import FunctionHideChildOne from '@/views/function/hide-child/one/index.vue';

// 隐藏子菜单 One (P3-06)：hideInMenu 让侧栏不出现该条目；
// activeMenu 指回父菜单路由名 FunctionHideChildIndex，保证高亮不掉。
definePage({
  meta: {
    title: '隐藏子菜单 1',
    i18nKey: 'route.functionHideChildOne',
    hideInMenu: true,
    activeMenu: 'FunctionHideChildIndex'
  }
});
</script>

<template>
  <FunctionHideChildOne />
</template>
