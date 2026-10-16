<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExceptionBase from '@/components/exception-base/index.vue';

/** 404 页面不存在（P3-07：改用统一异常壳） 详见 docs/v3-notes.md N-303。 */
definePage({
  name: 'NotFound',
  layout: 'blank',
  meta: {
    title: '页面不存在',
    i18nKey: 'common.notFound'
  }
});

const { t } = useI18n();
</script>

<template>
  <ExceptionBase code="404" :title="t('common.notFound')" :description="t('common.notFoundDesc')" />
</template>
