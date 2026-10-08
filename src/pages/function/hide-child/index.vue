<script setup lang="ts">
import FunctionHideChild from '@/views/function/hide-child/index.vue';

definePage({
  meta: {
    title: '隐藏子菜单',
    i18nKey: 'route.functionHideChild',
    icon: 'mdi:eye-off-outline',
    order: 24
  }
});
</script>

<template>
  <FunctionHideChild />
</template>
