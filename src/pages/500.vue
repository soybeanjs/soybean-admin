<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import ExceptionBase from '@/components/exception-base/index.vue';
import { getRouter } from '@/router/instance';

/**
 * 500 服务异常（P3-07）。
 *
 * 本仓是 SPA + 服务端 API 的形态，「服务端渲染失败」这条路径不存在
 * （`ubean.config.ts` 的 `ssr: false`），所以 500 页不是自动跳转目标，而是：
 * 1. 业务侧遇到不可恢复错误时可主动 `push('/500')` 的可视化出口；
 * 2. 请求层 `SYSTEM_ERROR` / 网络异常时给用户的「重试」落点 —— 页面把来源
 *    （`?from=`）透传出来，重试即重新导航回原路径。
 *
 * 必须 `requiresAuth: false`：系统异常时用户可能刚好处于登录态失效状态，
 * 再被守卫推去登录页会掩盖真实错误。
 */
definePage({
  name: 'ServiceError',
  layout: 'blank',
  requiresAuth: false,
  meta: {
    title: '服务异常',
    i18nKey: 'common.serviceError',
    hideInMenu: true
  }
});

const { t } = useI18n();
const route = useRoute();

/** 来源路径（`?from=`）：重试时导航回去；缺省时只留「回到首页」 */
const from = computed(() => (typeof route.query.from === 'string' ? route.query.from : ''));

function retry(): void {
  if (from.value) void getRouter().push(from.value);
}
</script>

<template>
  <ExceptionBase code="500" :title="t('common.serviceError')" :description="t('common.serviceErrorDesc')">
    <SButton v-if="from" variant="soft" color="warning" @click="retry">{{ t('common.retry') }}</SButton>
  </ExceptionBase>
</template>
