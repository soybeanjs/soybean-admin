<script setup lang="ts">
import FunctionMultiTab from '@/views/function/multi-tab/index.vue';

definePage({
  meta: {
    title: '多标签页',
    i18nKey: 'route.functionMultiTab',
    icon: 'mdi:tab-multiple',
    order: 21,
    multiTab: true
  }
});
</script>

<template>
  <FunctionMultiTab />
</template>
