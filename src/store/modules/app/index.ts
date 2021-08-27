import { defineStore } from 'pinia';
import type { GlobalThemeOverrides } from 'naive-ui';
import { store } from '../../index';
import { themeSettings } from '@/settings';
import type { ThemeSettings } from '@/interface';
import { getHoverAndPressedColor } from './helpers';

interface AppState {
  /** 主题配置 */
  themeSettings: ThemeSettings;
  /** 侧边栏折叠 */
  asideCollapse: boolean;
}

const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    themeSettings,
    asideCollapse: false
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
    handleAsideCollapse(collapse: boolean) {
      this.asideCollapse = collapse;
    },
    toggleAside() {
      this.asideCollapse = !this.asideCollapse;
    }
  }
});

export default function useAppStore() {
  return appStore(store);
}
