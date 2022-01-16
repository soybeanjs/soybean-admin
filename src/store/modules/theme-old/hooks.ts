import { watch, onUnmounted } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { useOsTheme } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { objectAssign } from '@/utils';
import type { ThemeSetting, ThemeLayoutMode, ThemeTabMode, ThemeAnimateMode } from '@/interface';
import { handleWindicssDarkMode, updateThemeCssVarsByPrimary } from './helpers';

export interface LayoutFunc {
  /** 设置布局最小宽度 */
  setLayoutMinWidth(minWidth: number): void;
  /** 设置布局模式 */
  setLayoutMode(mode: ThemeLayoutMode): void;
}
export function useLayoutFunc(layout: ThemeSetting['layout']): LayoutFunc {
  function setLayout(data: Partial<ThemeSetting['layout']>) {
    objectAssign(layout, data);
  }

  function setLayoutMinWidth(minWidth: number) {
    setLayout({ minWidth });
  }
  function setLayoutMode(mode: ThemeLayoutMode) {
    setLayout({ mode });
  }

  return {
    setLayoutMinWidth,
    setLayoutMode
  };
}

export interface HeaderFunc {
  /** 设置头部高度 */
  setHeaderHeight(height: number): void;
  /** 设置头部面包屑可见 */
  setHeaderCrumbVisible(visible: boolean): void;
  /** 设置头部面包屑图标可见 */
  setHeaderCrumbIconVisible(visible: boolean): void;
}
export function useHeaderFunc(header: ThemeSetting['header']): HeaderFunc {
  function setHeader(data: Partial<ThemeSetting['header']>) {
    objectAssign(header, data);
  }

  function setHeaderHeight(height: number) {
    setHeader({ height });
  }
  function setHeaderCrumbVisible(visible: boolean) {
    setHeader({ crumb: { ...header.crumb, visible } });
  }
  function setHeaderCrumbIconVisible(visible: boolean) {
    setHeader({ crumb: { ...header.crumb, showIcon: visible } });
  }

  return {
    setHeaderHeight,
    setHeaderCrumbVisible,
    setHeaderCrumbIconVisible
  };
}

export interface TabFunc {
  /** 设置多页签可见 */
  setTabVisible(visible: boolean): void;
  /** 设置多页签高度 */
  setTabHeight(height: number): void;
  /** 设置多页签风格 */
  setTabMode(mode: ThemeTabMode): void;
  /** 设置多页签缓存 */
  setTabIsCache(isCache: boolean): void;
}
export function useTabFunc(tab: ThemeSetting['tab']): TabFunc {
  function setTab(data: Partial<ThemeSetting['tab']>) {
    objectAssign(tab, data);
  }

  function setTabVisible(visible: boolean) {
    setTab({ visible });
  }
  function setTabHeight(height: number) {
    setTab({ height });
  }
  function setTabMode(mode: ThemeTabMode) {
    setTab({ mode });
  }
  function setTabIsCache(isCache: boolean) {
    setTab({ isCache });
  }

  return {
    setTabVisible,
    setTabHeight,
    setTabMode,
    setTabIsCache
  };
}

export interface SiderFunc {
  /** 侧边栏宽度 */
  setSiderWidth(width: number): void;
  /** 侧边栏折叠时的宽度 */
  setSiderCollapsedWidth(width: number): void;
  /** vertical-mix模式下侧边栏宽度 */
  setMixSiderWidth(width: number): void;
  /** vertical-mix模式下侧边栏折叠时的宽度 */
  setMixSiderCollapsedWidth(width: number): void;
  /** vertical-mix模式下侧边栏展示子菜单的宽度 */
  setMixSiderChildMenuWidth(width: number): void;
}
export function useSiderFunc(sider: ThemeSetting['sider']): SiderFunc {
  function setSider(data: Partial<ThemeSetting['sider']>) {
    objectAssign(sider, data);
  }

  function setSiderWidth(width: number) {
    setSider({ width });
  }
  function setSiderCollapsedWidth(width: number) {
    setSider({ collapsedWidth: width });
  }
  function setMixSiderWidth(width: number) {
    setSider({ mixWidth: width });
  }
  function setMixSiderCollapsedWidth(width: number) {
    setSider({ mixCollapsedWidth: width });
  }
  function setMixSiderChildMenuWidth(width: number) {
    setSider({ mixChildMenuWidth: width });
  }

  return {
    setSiderWidth,
    setSiderCollapsedWidth,
    setMixSiderWidth,
    setMixSiderCollapsedWidth,
    setMixSiderChildMenuWidth
  };
}

export interface FooterFunc {
  /** 设置底部是否固定 */
  setFooterIsFixed(isFixed: boolean): void;
  /** 设置底部高度 */
  setFooterHeight(height: number): void;
}
export function useFooterFunc(footer: ThemeSetting['footer']): FooterFunc {
  function setFooter(data: Partial<ThemeSetting['footer']>) {
    objectAssign(footer, data);
  }

  function setFooterIsFixed(isFixed: boolean) {
    setFooter({ fixed: isFixed });
  }
  function setFooterHeight(height: number) {
    setFooter({ height });
  }

  return {
    setFooterIsFixed,
    setFooterHeight
  };
}

export interface PageFunc {
  /** 设置切换页面时是否过渡动画 */
  setPageIsAnimate(animate: boolean): void;
  /** 设置页面过渡动画类型 */
  setPageAnimateMode(mode: ThemeAnimateMode): void;
}
export function usePageFunc(page: ThemeSetting['page']): PageFunc {
  function setPage(data: Partial<ThemeSetting['page']>) {
    objectAssign(page, data);
  }

  function setPageIsAnimate(animate: boolean) {
    setPage({ animate });
  }
  function setPageAnimateMode(mode: ThemeAnimateMode) {
    setPage({ animateMode: mode });
  }

  return {
    setPageIsAnimate,
    setPageAnimateMode
  };
}

/**
 * 操作系统主题模式变化的回调函数
 * @param isDark - 暗黑模式
 */
type OsThemeCallback = (isDark: boolean) => void;

/** 监听操作系统主题模式 */
export function osThemeWatcher(callback: OsThemeCallback) {
  /** 操作系统暗黑主题 */
  const osTheme = useOsTheme();

  const stopHandle = watch(
    osTheme,
    newValue => {
      const isDark = newValue === 'dark';
      callback(isDark);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    stopHandle();
  });
}

/** 应用windicss的暗黑模式 */
export function setupWindicssDarkMode(darkMode: Ref<boolean>) {
  const { addDarkClass, removeDarkClass } = handleWindicssDarkMode();

  const stopHandle = watch(
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

  onUnmounted(() => {
    stopHandle();
  });
}

/**
 * 禁用横向滚动
 * @description 页面切换时,过渡动画会产生水平方向的滚动条, 小于最小宽度时，不禁止
 */
export function setupHiddenScroll(minWidthOfLayout: ComputedRef<number>) {
  const { width } = useElementSize(document.documentElement);

  const stopHandle = watch(width, newValue => {
    if (newValue < minWidthOfLayout.value) {
      document.documentElement.style.overflowX = 'auto';
    } else {
      document.documentElement.style.overflowX = 'hidden';
    }
  });

  onUnmounted(() => {
    stopHandle();
  });
}

/**
 * 监听主题颜色的变化
 * @param themeColor
 */
export function themeColorWatcher(themeColor: Ref<string>) {
  const stopHandle = watch(themeColor, newValue => {
    updateThemeCssVarsByPrimary(newValue);
  });
  onUnmounted(() => {
    stopHandle();
  });
}
