<script setup lang="ts">
import FunctionRequest from '@/views/function/request/index.vue';

definePage({
  meta: {
    title: '请求演示',
    i18nKey: 'route.functionRequest',
    icon: 'mdi:swap-horizontal',
    order: 22
  }
});
</script>

<template>
  <FunctionRequest />
</template>
