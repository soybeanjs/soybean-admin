import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { useReload, useModalVisible, useBoolean } from '@/hooks';

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
  /** 侧边栏折叠状态 */
  siderCollapse: Ref<boolean>;
  /** 设置侧边栏折叠状态 */
  setSiderCollapse(collapse: boolean): void;
  /** vertical-mix模式下 侧边栏的固定状态 */
  mixSiderFixed: Ref<boolean>;
  /** 设置 vertical-mix模式下 侧边栏的固定状态 */
  setMixSiderIsFixed(isFixed: boolean): void;
}

export const useAppStore = defineStore('app-store', () => {
  // 重新加载页面
  const { reloadFlag, handleReload } = useReload();

  // 设置抽屉
  const {
    visible: settingDrawerVisible,
    openModal: openSettingDrawer,
    closeModal: closeSettingDrawer,
    toggleModal: toggleSettingdrawerVisible
  } = useModalVisible();

  // 侧边栏的折叠状态
  const { bool: siderCollapse, setBool: setSiderCollapse } = useBoolean();

  // vertical-mix模式下 侧边栏的固定状态
  const { bool: mixSiderFixed, setBool: setMixSiderIsFixed } = useBoolean();

  const appStore: AppStore = {
    reloadFlag,
    handleReload,
    settingDrawerVisible,
    openSettingDrawer,
    closeSettingDrawer,
    toggleSettingdrawerVisible,
    siderCollapse,
    setSiderCollapse,
    mixSiderFixed,
    setMixSiderIsFixed
  };

  return appStore;
});
