<script setup lang="ts">
import ManageOrg from '@/views/manage/org/index.vue';

/**
 * 组织管理页壳（P3-03）。
 */
definePage({
  meta: {
    title: '组织管理',
    i18nKey: 'route.manageOrg',
    icon: 'mdi:office-building',
    order: 15
  }
});
</script>

<template>
  <ManageOrg />
</template>
