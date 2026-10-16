<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SCard } from '@vean/ui';
import { useTabStore } from '@/store';

/** 全量演示 tab store 的对外能力： 详见 docs/v3-notes.md N-312。 */
defineOptions({ name: 'FunctionTab' });

const { t } = useI18n();
const tabStore = useTabStore();
const router = useRouter();

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
  tabStore.closeAndSwitch(router, tabStore.activeTabValue);
}

/** 关闭「首页」页签（Index 是首页的路由名，pinned 页签不可关 → 会静默忽略） */
function closeHome() {
  tabStore.closeAndSwitch(router, 'Index');
}

/** 直接切到「关于」以外的已有页签（没有任何页签时不做） */
function switchFirst() {
  const first = tabStore.tabs.find(tab => tab.value !== tabStore.activeTabValue);

  if (first) tabStore.switchTab(router, first.value);
}

definePage({
  meta: {
    title: '标签页操作',
    i18nKey: 'route.functionTab',
    icon: 'mdi:tab',
    order: 20
  }
});
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
