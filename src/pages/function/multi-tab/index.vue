<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SCard } from '@vean/ui';

/** 多标签页（P3-06，v3 §4.6「多标签」） 详见 docs/v3-notes.md N-309。 */
defineOptions({ name: 'FunctionMultiTab' });

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

/** 当前 query 的可读快照（`useRoute()` 的 query 是响应式的） */
const queryText = computed(() => {
  const entries = Object.entries(route.query);

  if (entries.length === 0) return '';

  return entries.map(([key, value]) => `${key} = ${String(value)}`).join('\n');
});

function toTab() {
  void router.push('/function/tab');
}

/** 再开一个本页页签（换 query → 新的 fullPath → 新页签） */
function openAnother() {
  void router.push({ path: '/function/multi-tab', query: { a: String(Date.now()) } });
}

definePage({
  meta: {
    title: '多标签页',
    i18nKey: 'route.functionMultiTab',
    icon: 'mdi:tab-multiple',
    order: 21,
    multiTab: true
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('function.multiTab.title')">
      <p class="text-sm opacity-70">{{ t('function.multiTab.description') }}</p>
    </SCard>

    <SCard :title="t('function.multiTab.queryLabel')">
      <pre v-if="queryText" class="overflow-x-auto rounded bg-gray-100 p-3 text-sm dark:bg-gray-800">{{
        queryText
      }}</pre>
      <p v-else class="text-sm opacity-60">{{ t('function.multiTab.emptyQuery') }}</p>
    </SCard>

    <SCard :title="t('common.actions')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="outline" @click="openAnother">{{ t('function.multiTab.openAnother') }}</SButton>
        <SButton variant="soft" @click="toTab">{{ t('function.multiTab.toTab') }}</SButton>
      </div>
    </SCard>
  </div>
</template>
