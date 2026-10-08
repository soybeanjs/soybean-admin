<script setup lang="ts">
import FunctionSuperPage from '@/views/function/super-page/index.vue';

// 超管可见页 (P3-06)：roles 由守卫判定，非 super 访问 → 403。
definePage({
  meta: {
    title: '超管可见页',
    i18nKey: 'route.functionSuperPage',
    icon: 'mdi:shield-crown-outline',
    order: 25,
    roles: ['super']
  }
});
</script>

<template>
  <FunctionSuperPage />
</template>
