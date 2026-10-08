<script setup lang="ts">
import ManageDictItem from '@/views/manage/dict-item/index.vue';

/**
 * 字典项管理页壳（P3-03）。
 */
definePage({
  meta: {
    title: '字典项管理',
    i18nKey: 'route.manageDictItem',
    icon: 'mdi:format-list-bulleted',
    order: 17
  }
});
</script>

<template>
  <ManageDictItem />
</template>
