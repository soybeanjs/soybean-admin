<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SAlert, SCard, STag } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';

/**
 * 超管可见页（P3-06，v3 §4.6）。
 *
 * 路由声明 `meta.roles: ['super']` —— 守卫（`src/router/guard.ts`）用
 * `@/shared/permission` 的 `hasRole` 判定：非 super 访问直接重定向到 403，
 * **正常路径下非超管根本进不到本组件**。所以这里不再做二次拦截，只展示
 * 当前身份与「为什么能看到」的说明。
 */
defineOptions({ name: 'FunctionSuperPage' });

const { t } = useI18n();
const authStore = useAuthStore();

const currentRoles = computed(() => authStore.userInfo?.roles ?? []);
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('function.superPage.title')">
      <p class="text-sm opacity-70">{{ t('function.superPage.description') }}</p>
    </SCard>

    <SCard :title="t('function.superPage.roles')">
      <div class="flex flex-wrap items-center gap-2">
        <STag v-for="role in currentRoles" :key="role" variant="soft" color="primary">{{ role }}</STag>
        <span v-if="currentRoles.length === 0">-</span>
      </div>
      <p class="mt-3 text-sm opacity-60">
        {{ t('function.superPage.current') }}: {{ authStore.userInfo?.username ?? '-' }}
      </p>
    </SCard>

    <SAlert variant="soft" color="warning" :title="t('function.toggleAuth.title')">
      {{ t('function.toggleAuth.description') }}
    </SAlert>
  </div>
</template>
