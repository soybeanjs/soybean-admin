import { defineStore } from 'pinia';
import type { GlobalThemeOverrides } from 'naive-ui';
import { themeSettings } from '@/settings';
import { store } from '@/store';
import type { ThemeSettings, NavMode } from '@/interface';
import { getHoverAndPressedColor } from './helpers';

interface AppState {
  /** 主题配置 */
  themeSettings: ThemeSettings;
  /** 主题配置抽屉 */
  settingDrawer: SettingDrawer;
}

interface SettingDrawer {
  visible: boolean;
}

const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    themeSettings,
    settingDrawer: {
      visible: false
    }
  }),
  getters: {
    /** naive UI主题配置 */
    themeOverrids(): GlobalThemeOverrides {
      const {
        themeColor: primaryColor,
        otherColor: { info: infoColor, success: successColor, warning: warningColor, error: errorColor }
      } = this.themeSettings;

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
    /** 折叠/展开菜单 */
    handleMenuCollapse(collapsed: boolean) {
      this.themeSettings.menuStyle.collapsed = collapsed;
    },
    /** 切换折叠/展开菜单 */
    toggleMenu() {
      this.themeSettings.menuStyle.collapsed = !this.themeSettings.menuStyle.collapsed;
    },
    /** 打开配置抽屉 */
    openSettingDrawer() {
      this.settingDrawer.visible = true;
    },
    /** 关闭配置抽屉 */
    closeSettingDrawer() {
      this.settingDrawer.visible = false;
    },
    /** 设置暗黑模式 */
    handleDarkMode(isDark: boolean) {
      this.themeSettings.darkMode = isDark;
    },
    /** 设置系统主题颜色 */
    setThemeColor(color: string) {
      this.themeSettings.themeColor = color;
    },
    /** 设置导航栏模式 */
    setNavMode(mode: NavMode) {
      this.themeSettings.navStyle.mode = mode;
    },
    /** 折叠菜单 */
    handleSplitMenu(isSplit: boolean) {
      this.themeSettings.menuStyle.splitMenu = isSplit;
    },
    /** 固定头部 */
    handleFixedHeader(isFixed: boolean) {
      this.themeSettings.headerStyle.fixed = isFixed;
    }
  }
});

export default function useAppStore() {
  return appStore(store);
}
