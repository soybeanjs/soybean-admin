<script setup lang="ts">
import ManagePermission from '@/views/manage/permission/index.vue';

/**
 * 权限管理页壳（P3-03）。
 */
definePage({
  meta: {
    title: '权限管理',
    i18nKey: 'route.managePermission',
    icon: 'mdi:shield-key',
    order: 14
  }
});
</script>

<template>
  <ManagePermission />
</template>
