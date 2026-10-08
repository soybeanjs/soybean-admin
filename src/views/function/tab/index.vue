<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SCard } from '@vean/ui';
import { useTabStore } from '@/store';
import { getRouter } from '@/router/instance';

/**
 * 标签页操作（P3-06，v3 §4.6「function：标签页」）。
 *
 * 全量演示 tab store 的对外能力：
 * - 跳转（首页 / 多标签页 / 超管页）—— 页签由 `afterEach` 守卫自动补；
 * - `closeAndSwitch` 关闭当前页签并落到相邻页签；
 * - `removeTab` 按「路由名」关闭指定页签（普通页 tab value = 路由名）；
 * - `switchTab` 在多标签页之间切换激活；
 * - 404：`addTab` 对 `NotFound` 直接返回，所以 404 不进页签。
 */
defineOptions({ name: 'FunctionTab' });

const { t } = useI18n();
const tabStore = useTabStore();
const router = getRouter();

function toHome() {
  void router.push('/');
}

function toMultiTab() {
  void router.push('/function/multi-tab');
}

function toMultiTabWithQuery() {
  void router.push({ path: '/function/multi-tab', query: { a: '1' } });
}

function toSuperPage() {
  void router.push('/function/super-page');
}

function toMissing() {
  void router.push('/function/not-exist-page');
}

/** 关闭当前页签：`closeAndSwitch` 内部先 removeTab 再跳相邻页签 */
function closeActive() {
  tabStore.closeAndSwitch(tabStore.activeTabValue);
}

/** 关闭「首页」页签（Index 是首页的路由名，pinned 页签不可关 → 会静默忽略） */
function closeHome() {
  tabStore.closeAndSwitch('Index');
}

/** 直接切到「关于」以外的已有页签（没有任何页签时不做） */
function switchFirst() {
  const first = tabStore.tabs.find(tab => tab.value !== tabStore.activeTabValue);

  if (first) tabStore.switchTab(first.value);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('function.tab.title')">
      <p class="text-sm opacity-70">{{ t('function.tab.description') }}</p>
    </SCard>

    <SCard :title="t('common.actions')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="outline" @click="toHome">{{ t('function.tab.toHome') }}</SButton>
        <SButton variant="outline" @click="toMultiTab">{{ t('function.tab.openMultiTab') }}</SButton>
        <SButton variant="outline" @click="toMultiTabWithQuery">{{ t('function.tab.openMultiTabQuery') }}</SButton>
        <SButton variant="outline" @click="toSuperPage">{{ t('function.tab.openSuperPage') }}</SButton>
        <SButton variant="outline" @click="toMissing">{{ t('function.tab.openNoTab') }}</SButton>
      </div>
    </SCard>

    <SCard :title="t('tab.close')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="soft" color="warning" @click="closeActive">{{ t('function.tab.closeActive') }}</SButton>
        <SButton variant="soft" color="destructive" @click="closeHome">{{ t('function.tab.closeByName') }}</SButton>
        <SButton variant="ghost" @click="switchFirst">{{ t('function.tab.switchActive') }}</SButton>
      </div>
    </SCard>
  </div>
</template>
