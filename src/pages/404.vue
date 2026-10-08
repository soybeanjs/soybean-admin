<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExceptionBase from '@/components/exception-base/index.vue';

/**
 * 404 页面不存在（P3-07：改用统一异常壳）。
 *
 * 命中路径：路由表里没有的路径（`ubean.config.ts` 的
 * `routing.notFoundRouteComponent: '404.vue'`）。守卫对 dynamic 模式做过一次
 * 「初始化后重跳原路径」的补偿，所以真 404 不会被菜单未就绪误判。
 */
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
