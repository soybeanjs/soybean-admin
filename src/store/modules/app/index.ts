import { defineStore } from 'pinia';
import type { GlobalThemeOverrides } from 'naive-ui';
import { themeSettings } from '@/settings';
import type { ThemeSettings } from '@/interface';
import { store } from '../../index';
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
    /** 设置系统主题颜色 */
    setThemeColor(color: string) {
      this.themeSettings.themeColor = color;
    }
  }
});

export default function useAppStore() {
  return appStore(store);
}
