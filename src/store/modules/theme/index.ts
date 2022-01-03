import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { useThemeVars } from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';
import { kebabCase } from 'lodash-es';
import { getColorPalette } from '@/utils';
import { getThemeColors } from './helpers';

interface OtherColor {
  /** 信息 */
  info: string;
  /** 成功 */
  success: string;
  /** 警告 */
  warning: string;
  /** 错误 */
  error: string;
}

interface ThemeStore {
  /** 主题颜色 */
  themeColor: Ref<string>;
  /** 其他颜色 */
  otherColor: ComputedRef<OtherColor>;
  /** naiveUI的主题配置 */
  naiveThemeOverrides: ComputedRef<GlobalThemeOverrides>;
  /** 添加css vars至html */
  addThemeCssVarsToRoot(): void;
}

type ThemeVarsKeys = keyof Exclude<GlobalThemeOverrides['common'], undefined>;

export const useThemeStore = defineStore('theme-store', () => {
  const themeVars = useThemeVars();

  const themeColor = ref('#1890ff');
  const otherColor = computed<OtherColor>(() => ({
    info: getColorPalette(themeColor.value, 7),
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  }));

  const naiveThemeOverrides = computed<GlobalThemeOverrides>(() => {
    const { info, success, warning, error } = otherColor.value;
    const themeColors = getThemeColors([
      ['primary', themeColor.value],
      ['info', info],
      ['success', success],
      ['warning', warning],
      ['error', error]
    ]);

    const colorLoading = themeColor.value;

    return {
      common: {
        ...themeColors
      },
      LoadingBar: {
        colorLoading
      }
    };
  });

  function addThemeCssVarsToRoot() {
    const updatedThemeVars = { ...themeVars.value };
    Object.assign(updatedThemeVars, naiveThemeOverrides.value.common);
    const keys = Object.keys(updatedThemeVars) as ThemeVarsKeys[];
    const style: string[] = [];
    keys.forEach(key => {
      style.push(`--${kebabCase(key)}: ${updatedThemeVars[key]}`);
    });
    const styleStr = style.join(';');
    document.documentElement.style.cssText += styleStr;
  }

  const themeStore: ThemeStore = {
    themeColor,
    otherColor,
    naiveThemeOverrides,
    addThemeCssVarsToRoot
  };

  return themeStore;
});
