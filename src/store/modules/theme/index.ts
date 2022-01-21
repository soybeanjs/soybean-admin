import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import type {
  ThemeSetting,
  ThemeLayoutMode,
  ThemeTabMode,
  ThemeHorizontalMenuPosition,
  ThemeAnimateMode
} from '@/interface';
import { getThemeSettings, getNaiveThemeOverrides, addThemeCssVarsToHtml } from './helpers';

type ThemeState = ThemeSetting;

export const useThemeStore = defineStore('theme-store', {
  state: (): ThemeState => getThemeSettings(),
  getters: {
    /** naiveUI的主题配置 */
    naiveThemeOverrides(state) {
      const overrides = getNaiveThemeOverrides({ primary: state.themeColor, ...state.otherColor });
      addThemeCssVarsToHtml(overrides.common!);
      return overrides;
    },
    /** naive-ui暗黑主题 */
    naiveTheme(state) {
      return state.darkMode ? darkTheme : undefined;
    }
  },
  actions: {
    /** 重置theme状态 */
    resetThemeStore() {
      this.$reset();
    },
    /** 设置暗黑模式 */
    setDarkMode(darkMode: boolean) {
      this.darkMode = darkMode;
    },
    /** 切换/关闭 暗黑模式 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    /** 设置布局最小宽度 */
    setLayoutMinWidth(minWidth: number) {
      this.layout.minWidth = minWidth;
    },
    /** 设置布局模式 */
    setLayoutMode(mode: ThemeLayoutMode) {
      this.layout.mode = mode;
    },
    /** 设置系统主题颜色 */
    setThemeColor(themeColor: string) {
      this.themeColor = themeColor;
    },
    /** 设置固定头部和多页签 */
    setIsFixedHeaderAndTab(isFixed: boolean) {
      this.fixedHeaderAndTab = isFixed;
    },
    /** 设置重载按钮可见状态 */
    setReloadVisible(visible: boolean) {
      this.showReload = visible;
    },
    /** 设置头部高度 */
    setHeaderHeight(height: number | null) {
      if (height) {
        this.header.height = height;
      }
    },
    /** 设置头部面包屑可见 */
    setHeaderCrumbVisible(visible: boolean) {
      this.header.crumb.visible = visible;
    },
    /** 设置头部面包屑图标可见 */
    setHeaderCrumbIconVisible(visible: boolean) {
      this.header.crumb.showIcon = visible;
    },
    /** 设置多页签可见 */
    setTabVisible(visible: boolean) {
      this.tab.visible = visible;
    },
    /** 设置多页签高度 */
    setTabHeight(height: number | null) {
      if (height) {
        this.tab.height = height;
      }
    },
    /** 设置多页签风格 */
    setTabMode(mode: ThemeTabMode) {
      this.tab.mode = mode;
    },
    /** 设置多页签缓存 */
    setTabIsCache(isCache: boolean) {
      this.tab.isCache = isCache;
    },
    /** 侧边栏宽度 */
    setSiderWidth(width: number | null) {
      if (width) {
        this.sider.width = width;
      }
    },
    /** 侧边栏折叠时的宽度 */
    setSiderCollapsedWidth(width: number) {
      this.sider.collapsedWidth = width;
    },
    /** vertical-mix模式下侧边栏宽度 */
    setMixSiderWidth(width: number | null) {
      if (width) {
        this.sider.mixWidth = width;
      }
    },
    /** vertical-mix模式下侧边栏折叠时的宽度 */
    setMixSiderCollapsedWidth(width: number) {
      this.sider.mixCollapsedWidth = width;
    },
    /** vertical-mix模式下侧边栏展示子菜单的宽度 */
    setMixSiderChildMenuWidth(width: number) {
      this.sider.mixChildMenuWidth = width;
    },
    /** 设置水平模式的菜单的位置 */
    setHorizontalMenuPosition(posiiton: ThemeHorizontalMenuPosition) {
      this.menu.horizontalPosition = posiiton;
    },
    /** 设置底部是否固定 */
    setFooterIsFixed(isFixed: boolean) {
      this.footer.fixed = isFixed;
    },
    /** 设置底部高度 */
    setFooterHeight(height: number) {
      this.footer.height = height;
    },
    /** 设置切换页面时是否过渡动画 */
    setPageIsAnimate(animate: boolean) {
      this.page.animate = animate;
    },
    /** 设置页面过渡动画类型 */
    setPageAnimateMode(mode: ThemeAnimateMode) {
      this.page.animateMode = mode;
    }
  }
});
