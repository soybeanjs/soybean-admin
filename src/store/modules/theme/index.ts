import { defineStore } from 'pinia';
import type { GlobalThemeOverrides } from 'naive-ui';
import { themeSettings } from '@/settings';
import { store } from '@/store';
import type { ThemeSettings, NavMode } from '@/interface';
import { getHoverAndPressedColor } from './helpers';

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
        themeColor: primaryColor,
        otherColor: { info: infoColor, success: successColor, warning: warningColor, error: errorColor }
      } = this;

      const { hover: primaryColorHover, pressed: primaryColorPressed } = getHoverAndPressedColor(primaryColor);
      const { hover: infoColorHover, pressed: infoColorPressed } = getHoverAndPressedColor(infoColor);
      const { hover: successColorHover, pressed: successColorPressed } = getHoverAndPressedColor(successColor);
      const { hover: warningColorHover, pressed: warningColorPressed } = getHoverAndPressedColor(warningColor);
      const { hover: errorColorHover, pressed: errorColorPressed } = getHoverAndPressedColor(errorColor);

      const colorLoading = primaryColor;

      return {
        common: {
          primaryColor,
          primaryColorHover,
          primaryColorPressed,
          infoColor,
          infoColorHover,
          infoColorPressed,
          successColor,
          successColorHover,
          successColorPressed,
          warningColor,
          warningColorHover,
          warningColorPressed,
          errorColor,
          errorColorHover,
          errorColorPressed
        },
        LoadingBar: {
          colorLoading
        }
      };
    }
  },
  actions: {
    /** 设置暗黑模式 */
    handleDarkMode(isDark: boolean) {
      this.darkMode = isDark;
    },
    /** 设置系统主题颜色 */
    setThemeColor(color: string) {
      this.themeColor = color;
    },
    /** 设置导航栏模式 */
    setNavMode(mode: NavMode) {
      this.navStyle.mode = mode;
    },
    /** 折叠菜单 */
    handleSplitMenu(isSplit: boolean) {
      this.menuStyle.splitMenu = isSplit;
    },
    /** 固定头部 */
    handleFixedHeader(isFixed: boolean) {
      this.headerStyle.fixed = isFixed;
    }
  }
});

export default function useThemeStore() {
  return themeStore(store);
}
