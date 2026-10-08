<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SKbd, toast } from '@vean/ui';
import { RESET_CACHE_STRATEGIES } from '@/constants/theme';
import type { ResetCacheStrategy } from '@/constants/theme';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { THEME_ROW_CLASS, THEME_SECTION_TITLE_CLASS, useSelectField } from './shared';
import type { ThemeOptionItem } from './shared';
import OptionRow from './option-row.vue';
import SwitchRow from './switch-row.vue';

defineOptions({ name: 'ThemeOperationPanel' });

const { t } = useI18n();

const themeStore = useThemeStore();
const appStore = useAppStore();

const resetStrategyItems = computed<ThemeOptionItem[]>(() =>
  RESET_CACHE_STRATEGIES.map(item => ({ value: item.value, label: t(item.label) }))
);

const resetCacheStrategy = useSelectField<ResetCacheStrategy>({
  get: () => themeStore.settings.resetCacheStrategy,
  items: ['close', 'refresh'],
  fallback: 'close',
  patch: value => ({ resetCacheStrategy: value })
});

/** 视觉障碍模拟：store 的 action 已保证两个开关互斥 */
function onGrayscale(value: boolean) {
  themeStore.setGrayscale(value);
}

function onColorWeakness(value: boolean) {
  themeStore.setColorWeakness(value);
}

/** 「复制配置」把当前主题设置写成 JSON 到剪贴板（对齐 v2 ConfigOperation 的配置导出） */
async function onCopyConfig() {
  const content = JSON.stringify(themeStore.settings, null, 2);
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    toast.warning(t('theme.copyUnsupported'));
    return;
  }
  try {
    await navigator.clipboard.writeText(content);
    toast.success(t('theme.copySuccess'));
  } catch {
    toast.error(t('theme.copyFailed'));
  }
}

function onResetConfig() {
  themeStore.resetThemeSettings();
  appStore.setThemeDrawerVisible(false);
  toast.success(t('theme.resetSuccess'));
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.operation.title') }}</span>
      <OptionRow v-model="resetCacheStrategy" :label="t('theme.resetCache.title')" :items="resetStrategyItems" />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.grayscaleTitle') }}</span>
      <SwitchRow
        :label="t('theme.grayscale')"
        :description="t('theme.grayscaleDesc')"
        :model-value="themeStore.settings.grayscale"
        @update:model-value="onGrayscale"
      />
      <SwitchRow
        :label="t('theme.colorWeakness')"
        :description="t('theme.colorWeaknessDesc')"
        :model-value="themeStore.settings.colorWeakness"
        @update:model-value="onColorWeakness"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.shortcuts.title') }}</span>
      <div :class="THEME_ROW_CLASS">
        <span class="text-sm">{{ t('theme.shortcuts.search') }}</span>
        <span class="flex items-center gap-1">
          <SKbd>Ctrl</SKbd>
          <SKbd>k</SKbd>
        </span>
      </div>
      <div :class="THEME_ROW_CLASS">
        <span class="text-sm">{{ t('theme.shortcuts.drawer') }}</span>
        <span class="flex items-center gap-1">
          <SKbd>Ctrl</SKbd>
          <SKbd>t</SKbd>
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 border-t border-border pt-4">
      <SButton variant="outline" size="sm" @click="onCopyConfig">{{ t('theme.copyConfig') }}</SButton>
      <SButton variant="plain" size="sm" @click="onResetConfig">{{ t('theme.resetConfig') }}</SButton>
    </div>
  </div>
</template>
