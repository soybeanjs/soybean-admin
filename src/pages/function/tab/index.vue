<script setup lang="ts">
import FunctionTab from '@/views/function/tab/index.vue';

definePage({
  meta: {
    title: '标签页操作',
    i18nKey: 'route.functionTab',
    icon: 'mdi:tab',
    order: 20
  }
});
</script>

<template>
  <FunctionTab />
</template>
