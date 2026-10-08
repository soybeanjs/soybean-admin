<script setup lang="ts">
import FunctionToggleAuth from '@/views/function/toggle-auth/index.vue';

definePage({
  meta: {
    title: '切换权限',
    i18nKey: 'route.functionToggleAuth',
    icon: 'mdi:account-switch',
    order: 23
  }
});
</script>

<template>
  <FunctionToggleAuth />
</template>
