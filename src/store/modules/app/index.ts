import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { useReload } from '@/hooks';

interface AppStore {
  /** 重载页面的标志 */
  reloadFlag: Ref<boolean>;
  /**
   * 触发重载页面
   * @param duration - 延迟时间(ms, 默认0)
   */
  handleReload(duration?: number): void;
}

export const useAppStore = defineStore('app-store', () => {
  // 重新加载页面
  const { reloadFlag, handleReload } = useReload();

  const appStore: AppStore = {
    reloadFlag,
    handleReload
  };

  return appStore;
});
