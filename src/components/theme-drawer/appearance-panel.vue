<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { resolveTokenColor } from '@vean/theme';
import { SButton, SThemeCustomizer, SThemeModeSegment, useTheme } from '@vean/ui';
import type { ThemeCustomizerSection } from '@vean/ui';
import { requestPreset } from '@/shared/theme-preset';
import { useThemeStore } from '@/store/modules/theme';
import { PRESET_CARD_CLASS, THEME_CONTROL_CLASS, THEME_ROW_CLASS, presetSwatchStyle } from './shared';

defineOptions({ name: 'ThemeAppearancePanel' });

const { t } = useI18n();

const themeStore = useThemeStore();
const theme = useTheme('ThemeAppearancePanel');

/**
 * 明暗模式不在 customizer 的 `mode` section 里重复：`SThemeModeSegment` 直接绑
 * `theme.mode`，放在抽屉顶部更显眼（对齐 v2 抽屉第一屏）。
 */
const sections = computed<ThemeCustomizerSection[]>(() => [
  'palette',
  'radius',
  'size',
  'spacing',
  'font',
  'scheme',
  'advanced'
]);

const presets = computed(() =>
  themeStore.presets.map(item => ({
    ...item,
    swatch: presetSwatchStyle(resolveTokenColor(item, 'primary', theme.effectiveMode.value, 'oklch'))
  }))
);

/** 生效的预设名：store 是唯一记录（自定义预设的「另存/应用」本轮不接，见 P2-10 范围） */
const activePresetName = computed(() => themeStore.settings.presetName);

function onPresetSelect(name: string) {
  if (!themeStore.presets.some(item => item.name === name)) return;

  themeStore.setPreset(name);
  requestPreset({ ...themeStore.presetThemeState });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div :class="THEME_ROW_CLASS">
      <span class="text-sm">{{ t('theme.mode') }}</span>
      <SThemeModeSegment :class="THEME_CONTROL_CLASS" />
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm">{{ t('theme.preset.title') }}</span>
      <div class="grid grid-cols-3 gap-2">
        <SButton
          v-for="preset in presets"
          :key="preset.name"
          variant="plain"
          :class="[PRESET_CARD_CLASS, activePresetName === preset.name ? 'border-primary' : 'border-transparent']"
          @click="onPresetSelect(preset.name)"
        >
          <span class="h-4 w-full shrink-0 rounded-full" :style="preset.swatch" />
          <span class="truncate text-xs">{{ t(preset.label) }}</span>
        </SButton>
      </div>
    </div>

    <!--
      `ui.root` 必须显式给 `w-full h-full`：`ui` 覆盖走 tailwind-merge **叠加**，
      而 recipe 默认是 `w-96 max-w-[calc(100vw-2rem)] max-h-fit h-[70vh]` —— 不显式
      给尺寸类，`w-96`（384px）与 `h-[70vh]`（实测 630px）都会留下来。抽屉内容列
      实测只有 334px，于是 customizer 右边超出 50px 被抽屉裁掉；高度上 `h-[70vh]`
      比父级可用高度还大，底部又溢出 22px。`w-full` / `h-full` 与默认值同属
      width / height 组，合并时后者胜出（`grow` 覆盖不了 `h-[70vh]`，必须给 `h-full`）。
    -->
    <SThemeCustomizer
      :sections="sections"
      :show-actions="false"
      :ui="{ root: 'flex w-full h-full flex-col gap-3 min-h-0', panel: 'space-y-4 p-0' }"
    />
  </div>
</template>
