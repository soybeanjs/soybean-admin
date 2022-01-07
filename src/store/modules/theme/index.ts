import { ref, computed, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { useThemeVars, darkTheme, useOsTheme } from 'naive-ui';
import type { GlobalThemeOverrides, GlobalTheme } from 'naive-ui';
import { useBoolean } from '@/hooks';
import { getColorPalette } from '@/utils';
import { getNaiveThemeOverrides, addThemeCssVarsToHtml, handleWindicssDarkMode } from './helpers';

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

type BuiltInGlobalTheme = Omit<Required<GlobalTheme>, 'InternalSelectMenu' | 'InternalSelection'>;

interface ThemeStore {
  /** 暗黑模式 */
  darkMode: Ref<boolean>;
  /** 设置暗黑模式 */
  setDarkMode(dark: boolean): void;
  /** 切换/关闭 暗黑模式 */
  toggleDarkMode(dark: boolean): void;
  /** 主题颜色 */
  themeColor: Ref<string>;
  /** 其他颜色 */
  otherColor: ComputedRef<OtherColor>;
  /** naiveUI的主题配置 */
  naiveThemeOverrides: ComputedRef<GlobalThemeOverrides>;
  /** naive-ui暗黑主题 */
  naiveTheme: ComputedRef<BuiltInGlobalTheme | undefined>;
}

export const useThemeStore = defineStore('theme-store', () => {
  const themeVars = useThemeVars();
  const { bool: darkMode, setBool: setDarkMode, toggle: toggleDarkMode } = useBoolean();
  const { addDarkClass, removeDarkClass } = handleWindicssDarkMode();

  const themeColor = ref('#1890ff');
  const otherColor = computed<OtherColor>(() => ({
    info: getColorPalette(themeColor.value, 7),
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  }));

  const naiveThemeOverrides = computed<GlobalThemeOverrides>(() =>
    getNaiveThemeOverrides({ primary: themeColor.value, ...otherColor.value })
  );

  /** naive-ui暗黑主题 */
  const naiveTheme = computed(() => (darkMode.value ? darkTheme : undefined));

  /** 操作系统暗黑主题 */
  const osTheme = useOsTheme();

  /** 初始化css vars, 并添加至html */
  function initThemeCssVars() {
    const updatedThemeVars = { ...themeVars.value, ...naiveThemeOverrides.value.common };
    addThemeCssVarsToHtml(updatedThemeVars);
  }

  function init() {
    initThemeCssVars();
  }

  init();

  // 监听操作系统主题模式
  watch(
    osTheme,
    newValue => {
      const isDark = newValue === 'dark';
      if (isDark) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    },
    { immediate: true }
  );
  // 监听主题的暗黑模式
  watch(
    () => darkMode.value,
    newValue => {
      if (newValue) {
        addDarkClass();
      } else {
        removeDarkClass();
      }
    },
    { immediate: true }
  );

  const themeStore: ThemeStore = {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    themeColor,
    otherColor,
    naiveThemeOverrides,
    naiveTheme
  };

  return themeStore;
});
