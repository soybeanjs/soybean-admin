import { defineStore } from 'pinia';
import { store } from '@/store';

/** app状态 */
interface AppState {
  menu: MenuState;
  settingDrawer: SettingDrawer;
}

/** 菜单状态 */
interface MenuState {
  /** 菜单折叠 */
  collapsed: boolean;
}

/** 设置抽屉的状态 */
interface SettingDrawer {
  /** 设置抽屉可见性 */
  visible: boolean;
}

const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    menu: {
      collapsed: false
    },
    settingDrawer: {
      visible: false
    }
  }),
  actions: {
    /** 折叠/展开菜单 */
    handleMenuCollapse(collapsed: boolean) {
      this.menu.collapsed = collapsed;
    },
    /** 切换折叠/展开菜单 */
    toggleMenu() {
      this.menu.collapsed = !this.menu.collapsed;
    },
    /** 打开配置抽屉 */
    openSettingDrawer() {
      this.settingDrawer.visible = true;
    },
    /** 关闭配置抽屉 */
    closeSettingDrawer() {
      this.settingDrawer.visible = false;
    }
  }
});

export default function useAppStore() {
  return appStore(store);
}
