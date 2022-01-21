import { watch, onUnmounted } from 'vue';
import { useOsTheme } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { setThemeColor } from '@/utils';
import { useThemeStore } from '../modules';

/** 订阅theme store */
export default function subscribeThemeStore() {
  const theme = useThemeStore();
  const osTheme = useOsTheme();
  const { width } = useElementSize(document.documentElement);
  const { addDarkClass, removeDarkClass } = handleWindicssDarkMode();

  const stopThemeColor = watch(
    () => theme.themeColor,
    newValue => {
      setThemeColor(newValue);
    },
    { immediate: true }
  );

  // 监听暗黑模式
  const stopDarkMode = watch(
    () => theme.darkMode,
    newValue => {
      if (newValue) {
        addDarkClass();
      } else {
        removeDarkClass();
      }
    }
  );

  // 监听操作系统主题模式
  const stopOsTheme = watch(
    osTheme,
    newValue => {
      const isDark = newValue === 'dark';
      theme.setDarkMode(isDark);
    },
    { immediate: true }
  );

  // 禁用横向滚动(页面切换时,过渡动画会产生水平方向的滚动条, 小于最小宽度时，不禁止)
  const stopWidth = watch(width, newValue => {
    if (newValue < theme.layout.minWidth) {
      document.documentElement.style.overflowX = 'auto';
    } else {
      document.documentElement.style.overflowX = 'hidden';
    }
  });

  onUnmounted(() => {
    stopThemeColor();
    stopDarkMode();
    stopOsTheme();
    stopWidth();
  });
}

/** windicss 暗黑模式 */
function handleWindicssDarkMode() {
  const DARK_CLASS = 'dark';
  function addDarkClass() {
    document.documentElement.classList.add(DARK_CLASS);
  }
  function removeDarkClass() {
    document.documentElement.classList.remove(DARK_CLASS);
  }
  return {
    addDarkClass,
    removeDarkClass
  };
}
