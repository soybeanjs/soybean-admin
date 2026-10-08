<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SCard } from '@vean/ui';
import { getRouter } from '@/router/instance';

/**
 * 多标签页（P3-06，v3 §4.6「多标签」）。
 *
 * 本页 `definePage({ meta: { multiTab: true } })`：tab store 的 `addTab` 用
 * `to.fullPath`（而非路由名）作为页签 value，所以**同一路由的不同 query 会
 * 各自成为一个页签**。页签切换时本页不会重挂载（同一路由记录，仅 query 变），
 * 因此必须用 `useRoute().query` 的响应式读取，而不是在 setup 里取一次快照。
 *
 * 不在本页展示「路由 params」——本页无动态段；`RouteParamForm` 的 params
 * 演示在菜单管理弹窗里（P3-03）。
 */
defineOptions({ name: 'FunctionMultiTab' });

const { t } = useI18n();
const route = useRoute();
const router = getRouter();

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
