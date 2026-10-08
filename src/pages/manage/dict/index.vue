<script setup lang="ts">
import ManageDict from '@/views/manage/dict/index.vue';

/**
 * 字典管理页壳（P3-03）。
 */
definePage({
  meta: {
    title: '字典管理',
    i18nKey: 'route.manageDict',
    icon: 'mdi:book-open-variant',
    order: 16
  }
});
</script>

<template>
  <ManageDict />
</template>
