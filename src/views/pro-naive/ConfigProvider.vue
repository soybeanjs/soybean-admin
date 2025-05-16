<script setup lang="tsx">
import { computed } from 'vue';
import { zhCN } from 'pro-naive-ui';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const locale = computed(() => {
  return appStore.locale === 'zh-CN' ? zhCN : undefined;
});
</script>

<template>
  <ProConfigProvider :locale="locale" class="h-full">
    <slot></slot>
  </ProConfigProvider>
</template>
