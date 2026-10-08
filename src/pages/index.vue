<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import { APP_VERSION } from '@/constants';
import { flatApi } from '@/request';
import type { HealthInfo } from '@/schema/system';

/**
 * 首页 —— Phase 0 的「链路自证页」：同时验证
 * 文件式路由 / 布局链 / i18n / typed client / OpenAPI codegen。
 */
definePage({
  meta: {
    title: '首页',
    i18nKey: 'common.home',
    icon: 'mdi:home'
  }
});

const { t } = useI18n();

const health = ref<HealthInfo | null>(null);
const errorMessage = ref('');
const pending = ref(false);

/**
 * `flatApi` 的路径是**剥掉前缀后**的 OpenAPI path：
 * `createTypedClient<paths, '/api'>` 已把 `/api` 从 path key 上移除。
 */
async function loadHealth(): Promise<void> {
  pending.value = true;
  errorMessage.value = '';

  const { data, error } = await flatApi.get('/system/health');

  pending.value = false;

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  health.value = data;
}

onMounted(loadHealth);
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
      <h1 class="text-2xl font-600">{{ t('app.title') }}</h1>
      <p class="mt-2 text-sm opacity-70">{{ t('app.description') }}</p>
      <p class="mt-4 text-xs opacity-50">{{ t('common.version') }}: {{ APP_VERSION }}</p>
    </section>

    <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-lg font-600">{{ t('common.health') }}</h2>
        <SButton size="sm" :disabled="pending" @click="loadHealth">GET /api/system/health</SButton>
      </div>

      <p v-if="errorMessage" class="mt-3 text-sm text-red-500">{{ errorMessage }}</p>
      <pre v-else-if="health" class="mt-3 text-xs">{{ JSON.stringify(health, null, 2) }}</pre>
      <p v-else class="mt-3 text-sm opacity-60">{{ t('common.loading') }}</p>
    </section>
  </div>
</template>
