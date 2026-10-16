<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import ExceptionBase from '@/components/exception-base/index.vue';

/** 403 无访问权限（P3-06 引入，P3-07 改用统一异常壳） 详见 docs/v3-notes.md N-302。 */
definePage({
  name: 'Forbidden',
  layout: 'blank',
  meta: {
    title: '无访问权限',
    i18nKey: 'common.forbidden',
    hideInMenu: true
  }
});

const { t } = useI18n();
const authStore = useAuthStore();

function relogin(): void {
  void authStore.logout();
}
</script>

<template>
  <ExceptionBase code="403" :title="t('common.forbidden')" :description="t('common.forbiddenDesc')">
    <SButton variant="ghost" @click="relogin">{{ t('common.relogin') }}</SButton>
  </ExceptionBase>
</template>
