<script setup lang="ts">
import ManageRole from '@/views/manage/role/index.vue';

/**
 * 角色管理页壳（P3-03）。
 */
definePage({
  meta: {
    title: '角色管理',
    i18nKey: 'route.manageRole',
    icon: 'mdi:account-group',
    order: 12
  }
});
</script>

<template>
  <ManageRole />
</template>
