<script setup lang="ts">
import { useI18n } from 'vue-i18n';

/**
 * 动态菜单缺页占位视图（menu store 的 `transformMenuToRoute` 兜底）。
 *
 * dynamic 路由模式下，菜单指向的 `view.*` 组件尚未在 `src/views/**`
 * 实现时落到这里（P2-04 的 dev 告警会列出缺页清单）。
 */
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-24">
    <div class="i-lucide:construction text-4xl text-warning" />
    <p class="text-lg font-medium">{{ t('common.viewUnderConstruction') }}</p>
    <p class="text-sm text-muted-foreground">{{ t('common.viewUnderConstructionDesc') }}</p>
  </div>
</template>
