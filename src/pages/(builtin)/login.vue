<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';

/**
 * 登录页占位（Phase 1 接入 `@ubean/auth` 前的最小可运行版本）。
 *
 * `(builtin)` 是 ubean 的**路由分组**目录：只影响文件组织，不进 URL。
 */
definePage({
  layout: 'blank',
  requiresAuth: false,
  meta: {
    title: '登录'
  }
});

const { t } = useI18n();
</script>

<template>
  <div class="flex-center h-full">
    <div class="w-80 rounded-lg border border-gray-200 p-8 dark:border-gray-800">
      <h1 class="mb-4 text-xl font-600">{{ t('common.login') }}</h1>
      <p class="text-sm opacity-70">Phase 1 接入 @ubean/auth 后在此实现登录表单。</p>
      <SButton class="mt-6 w-full" @click="$router.push('/')">{{ t('common.home') }}</SButton>
    </div>
  </div>
</template>
