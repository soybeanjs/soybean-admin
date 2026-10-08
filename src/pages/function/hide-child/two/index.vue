<script setup lang="ts">
import FunctionHideChildTwo from '@/views/function/hide-child/two/index.vue';

// 隐藏子菜单 Two (P3-06)：hideInMenu 让侧栏不出现该条目；
// activeMenu 指回父菜单路由名 FunctionHideChildIndex，保证高亮不掉。
definePage({
  meta: {
    title: '隐藏子菜单 2',
    i18nKey: 'route.functionHideChildTwo',
    hideInMenu: true,
    activeMenu: 'FunctionHideChildIndex'
  }
});
</script>

<template>
  <FunctionHideChildTwo />
</template>
