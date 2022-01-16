import { watch, onUnmounted } from 'vue';
import { useOsTheme } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { useThemeStore } from '@/store';

export function useTheme() {
  const osTheme = useOsTheme();
  const theme = useThemeStore();
  const { width } = useElementSize(document.documentElement);

  /** 监听操作系统主题模式 */
  const stopHandle = watch(
    osTheme,
    newValue => {
      const isDark = newValue === 'dark';
      theme.setDarkMode(isDark);
    },
    { immediate: true }
  );

  /**
   * 禁用横向滚动
   * @description 页面切换时,过渡动画会产生水平方向的滚动条, 小于最小宽度时，不禁止
   */
  const anotherStopHandle = watch(width, newValue => {
    if (newValue < theme.layout.minWidth) {
      document.documentElement.style.overflowX = 'auto';
    } else {
      document.documentElement.style.overflowX = 'hidden';
    }
  });

  onUnmounted(() => {
    stopHandle();
    anotherStopHandle();
  });
}
