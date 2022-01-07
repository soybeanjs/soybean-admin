import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { useReload, useBoolean } from '@/hooks';

interface AppStore {
  /** 重载页面的标志 */
  reloadFlag: Ref<boolean>;
  /**
   * 触发重载页面
   * @param duration - 延迟时间(ms, 默认0)
   */
  handleReload(duration?: number): void;
  /** 设置抽屉可见状态 */
  settingDrawerVisible: Ref<boolean>;
  /** 打开设置抽屉 */
  openSettingDrawer(): void;
  /** 关闭设置抽屉 */
  closeSettingDrawer(): void;
  /** 切换抽屉可见状态 */
  toggleSettingdrawerVisible(): void;
}

export const useAppStore = defineStore('app-store', () => {
  // 重新加载页面
  const { reloadFlag, handleReload } = useReload();

  // 设置抽屉
  const {
    bool: settingDrawerVisible,
    setTrue: openSettingDrawer,
    setFalse: closeSettingDrawer,
    toggle: toggleSettingdrawerVisible
  } = useBoolean();

  const appStore: AppStore = {
    reloadFlag,
    handleReload,
    settingDrawerVisible,
    openSettingDrawer,
    closeSettingDrawer,
    toggleSettingdrawerVisible
  };

  return appStore;
});
