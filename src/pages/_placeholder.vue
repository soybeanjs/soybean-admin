<script setup lang="ts">
import { useI18n } from 'vue-i18n';

/** 动态菜单缺页占位视图（menu store 的 `transformMenuToRoute` 兜底） 详见 docs/v3-notes.md N-305。 */
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-24">
    <div class="i-lucide:construction text-4xl text-warning" />
    <p class="text-lg font-medium">{{ t('common.viewUnderConstruction') }}</p>
    <p class="text-sm text-muted-foreground">{{ t('common.viewUnderConstructionDesc') }}</p>
  </div>
</template>
