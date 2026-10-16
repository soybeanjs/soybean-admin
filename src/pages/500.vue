<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import ExceptionBase from '@/components/exception-base/index.vue';

/** 必须 `requiresAuth: false`：系统异常时用户可能刚好处于登录态失效状态， 详见 docs/v3-notes.md N-304。 */
definePage({
  name: 'ServiceError',
  layout: 'blank',
  meta: {
    title: '服务异常',
    i18nKey: 'common.serviceError',
    hideInMenu: true,
    requiresAuth: false
  }
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

/** 来源路径（`?from=`）：重试时导航回去；缺省时只留「回到首页」 */
const from = computed(() => (typeof route.query.from === 'string' ? route.query.from : ''));

function retry(): void {
  if (from.value) void router.push(from.value);
}
</script>

<template>
  <ExceptionBase code="500" :title="t('common.serviceError')" :description="t('common.serviceErrorDesc')">
    <SButton v-if="from" variant="soft" color="warning" @click="retry">{{ t('common.retry') }}</SButton>
  </ExceptionBase>
</template>
