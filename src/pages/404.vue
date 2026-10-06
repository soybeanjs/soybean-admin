<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';

definePage({
  name: 'NotFound',
  layout: 'blank',
  meta: {
    title: '页面不存在'
  }
});

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-20">
    <p class="text-6xl font-700">404</p>
    <p class="text-sm opacity-70">{{ t('common.notFound') }}</p>
    <SButton variant="outline" @click="$router.push('/')">{{ t('common.backHome') }}</SButton>
  </div>
</template>
