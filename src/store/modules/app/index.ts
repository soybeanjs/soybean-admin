import { defineStore } from 'pinia';
import type { GlobalThemeOverrides } from 'naive-ui';
import { store } from '../../index';
import { themeSettings } from '@/settings';
import type { ThemeSettings } from '@/interface';
import { brightenColor } from '@/utils';

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
      const primaryColor = this.themeSettings.themeColor;
      const primaryColorHover = brightenColor(primaryColor);
      const primaryColorPressed = primaryColorHover;
      const colorLoading = primaryColor;

      return {
        common: {
          primaryColor,
          primaryColorHover,
          primaryColorPressed
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
