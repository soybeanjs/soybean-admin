<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { SDrawer, STabs } from '@vean/ui';
import { useAppStore } from '@/store/modules/app';
import { THEME_DRAWER_TABS } from './shared';
import type { ThemeDrawerTab } from './shared';
import AppearancePanel from './appearance-panel.vue';
import GeneralPanel from './general-panel.vue';
import LayoutPanel from './layout-panel.vue';
import OperationPanel from './operation-panel.vue';

defineOptions({ name: 'ThemeDrawer' });

const { t } = useI18n();

const appStore = useAppStore();

const activeTab = ref<ThemeDrawerTab>('appearance');

/** 抽屉容器样式覆盖 详见 docs/v3-notes.md N-044。 */
const drawerUi = {
  popup: 'w-[90vw] max-w-[90vw] sm:w-[400px] sm:max-w-[400px]',
  content: 'flex min-h-0 grow flex-col overflow-y-auto p-4'
};

const open = computed({
  get: () => appStore.themeDrawerVisible,
  set: (value: boolean) => appStore.setThemeDrawerVisible(value)
});

const tabItems = computed(() => THEME_DRAWER_TABS.map(item => ({ value: item.value, label: t(item.label) })));

/** Tab value → 面板组件（`STabs` 的 slot props 是宽类型，查表代替断言） */
const PANELS: Record<string, Component> = {
  appearance: AppearancePanel,
  layout: LayoutPanel,
  general: GeneralPanel,
  operation: OperationPanel
};

const OPERATION_PANEL = PANELS.operation;

function panelOf(value: unknown): Component {
  return PANELS[String(value)] ?? OPERATION_PANEL;
}
</script>

<template>
  <SDrawer
    v-model:open="open"
    side="right"
    :title="t('theme.drawerTitle')"
    :show-confirm="false"
    :show-cancel="false"
    :ui="drawerUi"
  >
    <STabs v-model="activeTab" :items="tabItems" :unmount-on-hide="false" class="flex min-h-0 grow flex-col gap-3">
      <template #content="{ value }">
        <component :is="panelOf(value)" />
      </template>
    </STabs>
  </SDrawer>
</template>
