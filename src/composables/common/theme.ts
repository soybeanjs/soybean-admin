import { computed, watch } from 'vue';
import { darkTheme } from 'naive-ui';
import { useDark } from '@vueuse/core';
import { useThemeStore } from '@/store';

/** 系统暗黑模式 */
export function useDarkMode() {
  const osDark = useDark();
  const theme = useThemeStore();
  const { handleDarkMode } = useThemeStore();

  /** naive-ui暗黑主题 */
  const naiveTheme = computed(() => (theme.darkMode ? darkTheme : undefined));

  // 监听操作系统主题模式
  watch(
    osDark,
    newValue => {
      handleDarkMode(newValue);
    },
    {
      immediate: true
    }
  );

  return {
    naiveTheme
  };
}
