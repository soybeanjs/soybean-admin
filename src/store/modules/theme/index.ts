import { defineStore } from 'pinia';
import type { GlobalThemeOverrides } from 'naive-ui';
import { themeSettings, defaultThemeSettings } from '@/settings';
import { store } from '@/store';
import type { ThemeSettings, NavMode, MultiTabMode, AnimateType, HorizontalMenuPosition } from '@/interface';
import { getThemeColors } from './helpers';

type ThemeState = ThemeSettings;

const themeStore = defineStore({
  id: 'theme-store',
  state: (): ThemeState => ({
    ...themeSettings
  }),
  getters: {
    /** naive UI主题配置 */
    themeOverrids(): GlobalThemeOverrides {
      const {
        themeColor,
        otherColor: { info, success, warning, error }
      } = this;

      const themeColors = getThemeColors([
        ['primary', themeColor],
        ['info', info],
        ['success', success],
        ['warning', warning],
        ['error', error]
      ]);

      const colorLoading = themeColor;

      return {
        common: {
          ...themeColors
        },
        LoadingBar: {
          colorLoading
        }
      };
    },
    isVerticalNav(): boolean {
      const { mode } = this.navStyle;
      return mode === 'vertical' || mode === 'vertical-mix';
    },
    pageAnimateType(): AnimateType | '' {
      return this.pageStyle.animate ? this.pageStyle.animateType : '';
    }
  },
  actions: {
    /** 设置默认配置 */
    setDefaultThemeStore() {
      Object.assign(this, defaultThemeSettings);
    },
    /** 设置暗黑模式 */
    handleDarkMode(isDark: boolean) {
      this.darkMode = isDark;
    },
    /** 切换暗黑模式 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    /** 设置系统主题颜色 */
    setThemeColor(color: string) {
      this.themeColor = color;
    },
    /** 设置导航栏模式 */
    setNavMode(mode: NavMode) {
      this.navStyle.mode = mode;
    },
    /** 更改菜单展开的宽度 */
    handleMenuWidth(width: number | null) {
      if (width !== null) {
        this.menuStyle.width = width;
      }
    },
    /** 更改混合菜单展开的宽度 */
    handleMixMenuWidth(width: number | null) {
      if (width !== null) {
        this.menuStyle.mixWidth = width;
      }
    },
    /** 更改顶部水平菜单的位置 */
    handleHorizontalMenuPosition(position: HorizontalMenuPosition) {
      this.menuStyle.horizontalPosition = position;
    },
    /** 更改头部的高度 */
    handleHeaderHeight(height: number | null) {
      if (height !== null) {
        this.headerStyle.height = height;
      }
    },
    /** 更改Tab标签的高度 */
    handleMultiTabHeight(height: number | null) {
      if (height !== null) {
        this.multiTabStyle.height = height;
      }
    },
    /** 设置多页签的显示 */
    handleMultiTabVisible(visible: boolean) {
      this.multiTabStyle.visible = visible;
    },
    /** 设置多页签的显示 */
    handleMultiTabMode(mode: MultiTabMode) {
      this.multiTabStyle.mode = mode;
    },
    /** 设置多页签缓存 */
    handleSetMultiTabCache(isCache: boolean) {
      this.multiTabStyle.isCache = isCache;
    },
    /** 设置面包屑的显示 */
    handleCrumbsVisible(visible: boolean) {
      this.crumbsStyle.visible = visible;
    },
    /** 设置面包屑图标的显示 */
    handleCrumbsIconVisible(visible: boolean) {
      this.crumbsStyle.showIcon = visible;
    },
    /** 开启页面切换动画 */
    handlePageAnimate(animate: boolean) {
      this.pageStyle.animate = animate;
    },
    /** 设置页面切换动画类型 */
    handlePageAnimateType(animateType: AnimateType) {
      if (this.pageStyle.animate) {
        this.pageStyle.animateType = animateType;
      }
    },
    /** 固定头部 */
    handleFixedHeaderAndTab(isFixed: boolean) {
      this.fixedHeaderAndTab = isFixed;
    }
  }
});

export default function useThemeStore() {
  return themeStore(store);
}
