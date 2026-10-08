<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SInput, SLabel } from '@vean/ui';
import type { LayoutScrollBehavior, PageTabsVariant } from '@vean/ui';
import {
  PAGE_ANIMATION_MODES,
  RESET_CACHE_STRATEGIES,
  SCROLL_MODES,
  TAB_VARIANTS,
  WATERMARK_TIME_FORMATS
} from '@/constants/theme';
import type { PageAnimationMode, ResetCacheStrategy, WatermarkTimeFormat } from '@/constants/theme';
import { useThemeStore } from '@/store/modules/theme';
import type { WatermarkSettings } from '@/store/modules/theme';
import { THEME_ROW_CLASS, THEME_SECTION_TITLE_CLASS, WATERMARK_TIME_FORMAT_ITEMS, useSelectField } from './shared';
import type { ThemeOptionItem } from './shared';
import OptionRow from './option-row.vue';
import SwitchRow from './switch-row.vue';

defineOptions({ name: 'ThemeGeneralPanel' });

const { t } = useI18n();

const themeStore = useThemeStore();

const scrollItems = computed<ThemeOptionItem[]>(() =>
  SCROLL_MODES.map(item => ({ value: item.value, label: t(item.label) }))
);

const tabStyleItems = computed<ThemeOptionItem[]>(() =>
  TAB_VARIANTS.map(item => ({ value: item.value, label: t(item.label) }))
);

const animateModeItems = computed<ThemeOptionItem[]>(() =>
  PAGE_ANIMATION_MODES.map(item => ({ value: item.value, label: t(item.label) }))
);

const resetStrategyItems = computed<ThemeOptionItem[]>(() =>
  RESET_CACHE_STRATEGIES.map(item => ({ value: item.value, label: t(item.label) }))
);

const scrollBehavior = useSelectField<LayoutScrollBehavior>({
  get: () => themeStore.settings.scrollBehavior,
  items: ['wrapper', 'content'],
  fallback: 'wrapper',
  patch: value => ({ scrollBehavior: value })
});

const tabStyle = useSelectField<PageTabsVariant>({
  get: () => themeStore.settings.tabStyle,
  items: ['chrome', 'card', 'slider'],
  fallback: 'chrome',
  patch: value => ({ tabStyle: value })
});

const pageAnimateMode = useSelectField<PageAnimationMode>({
  get: () => themeStore.settings.pageAnimateMode,
  items: PAGE_ANIMATION_MODES.map(item => item.value),
  fallback: 'fade-slide',
  patch: value => ({ pageAnimateMode: value })
});

const resetCacheStrategy = useSelectField<ResetCacheStrategy>({
  get: () => themeStore.settings.resetCacheStrategy,
  items: ['close', 'refresh'],
  fallback: 'close',
  patch: value => ({ resetCacheStrategy: value })
});

/** 以当前水印设置为底，覆盖若干字段（`setThemeSettings` 需要完整的 `watermark` 对象） */
function patchWatermark(patch: Partial<WatermarkSettings>): WatermarkSettings {
  return { ...themeStore.settings.watermark, ...patch };
}

/** 水印时间格式是嵌套字段，补丁里重建整个 `watermark` 对象 */
const watermarkTimeFormat = useSelectField<WatermarkTimeFormat>({
  get: () => themeStore.settings.watermark.timeFormat,
  items: WATERMARK_TIME_FORMATS,
  fallback: WATERMARK_TIME_FORMATS[0],
  patch: value => ({ watermark: patchWatermark({ timeFormat: value }) })
});

const watermarkText = computed({
  get: () => themeStore.settings.watermark.text,
  set: (value: string) => themeStore.setWatermark({ text: value })
});

/** 用户名与时间是互斥开关，必须走 store action（直接 v-model 会绕过互斥清理） */
function onWatermarkUserName(value: boolean) {
  themeStore.setWatermarkEnableUserName(value);
}

function onWatermarkTime(value: boolean) {
  themeStore.setWatermarkEnableTime(value);
}

const showTimeFormat = computed(
  () => themeStore.settings.watermark.enableTime && !themeStore.settings.watermark.enableUserName
);
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.page.title') }}</span>
      <OptionRow v-model="resetCacheStrategy" :label="t('theme.resetCache.title')" :items="resetStrategyItems" />
      <OptionRow v-model="scrollBehavior" :label="t('theme.scroll.title')" :items="scrollItems" />
      <SwitchRow v-model="themeStore.settings.pageAnimate" :label="t('theme.page.animate')" />
      <OptionRow
        v-if="themeStore.settings.pageAnimate"
        v-model="pageAnimateMode"
        :label="t('theme.page.animateMode')"
        :items="animateModeItems"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.header') }}</span>
      <SwitchRow v-model="themeStore.settings.breadcrumbVisible" :label="t('theme.breadcrumb.visible')" />
      <SwitchRow v-model="themeStore.settings.triggerVisible" :label="t('theme.siderTrigger')" />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.tab.title') }}</span>
      <OptionRow v-model="tabStyle" :label="t('theme.tab.mode')" :items="tabStyleItems" />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.watermark.title') }}</span>
      <SwitchRow v-model="themeStore.settings.watermark.visible" :label="t('theme.watermark.visible')" />
      <template v-if="themeStore.settings.watermark.visible">
        <div :class="THEME_ROW_CLASS">
          <SLabel class="text-sm">{{ t('theme.watermark.text') }}</SLabel>
          <SInput v-model="watermarkText" class="w-36" />
        </div>
        <SwitchRow
          :label="t('theme.watermark.userName')"
          :model-value="themeStore.settings.watermark.enableUserName"
          @update:model-value="onWatermarkUserName"
        />
        <SwitchRow
          :label="t('theme.watermark.time')"
          :model-value="themeStore.settings.watermark.enableTime"
          :disabled="themeStore.settings.watermark.enableUserName"
          @update:model-value="onWatermarkTime"
        />
        <OptionRow
          v-if="showTimeFormat"
          v-model="watermarkTimeFormat"
          :label="t('theme.watermark.timeFormat')"
          :items="WATERMARK_TIME_FORMAT_ITEMS"
        />
      </template>
    </div>
  </div>
</template>
