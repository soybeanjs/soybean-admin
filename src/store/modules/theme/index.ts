import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ThemeOptions, ThemeRadiusValue } from '@vean/theme';

type PaletteKey = NonNullable<ThemeOptions['base']>;

/** 一套主题预设（对应 v2 的 `src/theme/preset/*.json`） */
export interface ThemePreset {
  name: string;
  label: string;
  primary: PaletteKey;
  base: PaletteKey;
  radius: ThemeRadiusValue;
}

export const themePresets: ThemePreset[] = [
  { name: 'default', label: '默认', primary: 'indigo', base: 'zinc', radius: '0.625rem' },
  { name: 'sky', label: '天蓝', primary: 'sky', base: 'slate', radius: '0.5rem' },
  { name: 'emerald', label: '翠绿', primary: 'emerald', base: 'gray', radius: '0.25rem' }
];

/**
 * 主题**预设表**（应用级数据）。
 *
 * 只负责「一套预设长什么样」；主题的**运行时状态**（当前 base/primary/radius/
 * mode、明暗切换、持久化、自定义 preset）由 `@vean/ui` 的 `SConfigProvider`
 * 持有，消费方通过 `useTheme()` 读取与修改 —— 应用层不再自建一份 mode 状态，
 * 也不再手写 `<html class="dark">`（provider 的 `effectiveMode` watcher 会做）。
 *
 * 之所以还用 Pinia：预设表和「当前预设名」是跨组件的应用数据（Phase 2 的
 * 主题定制抽屉要用），且需要在 provider 之外（如 `src/app.vue`）读取。
 */
export const useThemeStore = defineStore('theme', () => {
  const presetName = ref(themePresets[0]!.name);

  const preset = computed(() => themePresets.find(item => item.name === presetName.value) ?? themePresets[0]!);

  /**
   * 传给 `SConfigProvider` 的 `theme` prop。
   *
   * 不传 `mode` —— 明暗偏好由 provider 内部状态 + `persistTheme` 信封管理，
   * 避免两处真值。
   */
  const configProviderTheme = computed<ThemeOptions>(() => ({
    base: preset.value.base,
    primary: preset.value.primary,
    radius: preset.value.radius,
    darkSelector: 'class'
  }));

  function setPreset(name: string): void {
    presetName.value = name;
  }

  return { presetName, preset, presets: themePresets, configProviderTheme, setPreset };
});
