<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, STabs, toast, SButton } from '@vean/ui';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import AppearancePanel from '@/components/theme-drawer/appearance-panel.vue';
import GeneralPanel from '@/components/theme-drawer/general-panel.vue';
import LayoutPanel from '@/components/theme-drawer/layout-panel.vue';
import OperationPanel from '@/components/theme-drawer/operation-panel.vue';
import { THEME_DRAWER_TABS } from '@/components/theme-drawer/shared';
import type { ThemeDrawerTab } from '@/components/theme-drawer/shared';

/**
 * 个人中心 · 设置（P3-09）。
 *
 * **直接复用主题抽屉的四个面板组件**，不抄一遍二十多个开关：抽屉里的面板本就
 * 没有抽屉依赖（各自只读 `themeStore`），所以同一份配置清单可以同时出现在
 * 抽屉和整页两种容器里。这样新增一个主题配置项只需改一处，两边自动同步。
 *
 * 差异只在容器：抽屉是 `SDrawer`，这里是 `SCard` + `STabs`；抽屉的 Tab 组件
 * 用 `unmount-on-hide=false` 保持状态，这里同样设置，避免来回切 Tab 丢失滚动位置。
 */

defineOptions({ name: 'UserCenterSettings' });

const { t } = useI18n();

const themeStore = useThemeStore();
const appStore = useAppStore();

const activeTab = ref<ThemeDrawerTab>('appearance');

const tabItems = computed(() => THEME_DRAWER_TABS.map(item => ({ value: item.value, label: t(item.label) })));

/** Tab value → 面板组件（`STabs` 的 slot props 是宽类型，查表代替断言） */
const PANELS: Record<string, Component> = {
  appearance: AppearancePanel,
  layout: LayoutPanel,
  general: GeneralPanel,
  operation: OperationPanel
};

const FALLBACK_PANEL = PANELS.appearance;

function panelOf(value: unknown): Component {
  return PANELS[String(value)] ?? FALLBACK_PANEL;
}

/** 恢复默认主题（抽屉里的「恢复默认」会同款关闭抽屉；整页场景没有抽屉可关） */
function onResetTheme(): void {
  themeStore.resetThemeSettings();
  toast.success(t('theme.resetSuccess'));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('userCenter.settings.title')">
      <p class="mb-3 text-sm opacity-60">{{ t('userCenter.settings.tip') }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <SButton variant="outline" size="sm" @click="appStore.setThemeDrawerVisible(true)">
          {{ t('userCenter.settings.openDrawer') }}
        </SButton>
        <SButton variant="plain" size="sm" @click="onResetTheme">{{ t('theme.resetConfig') }}</SButton>
      </div>
    </SCard>

    <SCard>
      <STabs v-model="activeTab" :items="tabItems" :unmount-on-hide="false" class="flex min-h-0 flex-col gap-3">
        <template #content="{ value }">
          <component :is="panelOf(value)" />
        </template>
      </STabs>
    </SCard>
  </div>
</template>
