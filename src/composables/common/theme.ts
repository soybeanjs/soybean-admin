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

  // windicss 暗黑模式
  const DARK_CLASS = 'dark';
  function getHtmlElement() {
    return document.querySelector('html');
  }
  function addDarkClass() {
    const html = getHtmlElement();
    if (html) {
      html.classList.add(DARK_CLASS);
    }
  }
  function removeDarkClass() {
    const html = getHtmlElement();
    if (html) {
      html.classList.remove(DARK_CLASS);
    }
  }

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
  // 监听主题的暗黑模式
  watch(
    () => theme.darkMode,
    newValue => {
      if (newValue) {
        addDarkClass();
      } else {
        removeDarkClass();
      }
    },
    { immediate: true }
  );

  return {
    naiveTheme
  };
}

/** 更改html样式 */
export function useHtmlStyle() {
  const HIDE_SCROLL_CLASS = 'overflow-hidden';

  function getHtmlElement() {
    return document.querySelector('html');
  }

  function handleHideScroll() {
    const html = getHtmlElement();
    if (html) {
      html.classList.add(HIDE_SCROLL_CLASS);
    }
  }
  function handleAutoScroll() {
    const html = getHtmlElement();
    if (html) {
      html.classList.remove(HIDE_SCROLL_CLASS);
    }
  }

  return {
    handleHideScroll,
    handleAutoScroll
  };
}
