<script setup lang="ts">
import FunctionHideChildThree from '@/views/function/hide-child/three/index.vue';

// 隐藏子菜单 Three (P3-06)：hideInMenu 让侧栏不出现该条目；
// activeMenu 指回父菜单路由名 FunctionHideChildIndex，保证高亮不掉。
definePage({
  meta: {
    title: '隐藏子菜单 3',
    i18nKey: 'route.functionHideChildThree',
    hideInMenu: true,
    activeMenu: 'FunctionHideChildIndex'
  }
});
</script>

<template>
  <FunctionHideChildThree />
</template>
