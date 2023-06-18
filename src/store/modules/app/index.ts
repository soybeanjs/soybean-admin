import { nextTick } from 'vue';
import { defineStore } from 'pinia';
import type { Socket } from 'socket.io-client';
import { LAYOUT_SCROLL_EL_ID } from '@soybeanjs/vue-materials';

interface AppState {
  /** 滚动元素的id */
  scrollElId: string;
  /** 主体内容全屏 */
  contentFull: boolean;
  /** 禁用主体内容的水平方向的滚动 */
  disableMainXScroll: boolean;
  /** 重载页面(控制页面的显示) */
  reloadFlag: boolean;
  /** 项目配置的抽屉可见状态 */
  settingDrawerVisible: boolean;
  /** 侧边栏折叠状态 */
  siderCollapse: boolean;
  /** vertical-mix模式下 侧边栏的固定状态 */
  mixSiderFixed: boolean;
  /** socket.io 实例 */
  socket: Socket | null;
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    scrollElId: LAYOUT_SCROLL_EL_ID,
    contentFull: false,
    disableMainXScroll: false,
    reloadFlag: true,
    settingDrawerVisible: false,
    siderCollapse: false,
    mixSiderFixed: false,
    socket: null
  }),
  actions: {
    /**
     * 获取滚动配置
     */
    getScrollConfig() {
      const scrollEl = document.querySelector(`#${this.scrollElId}`);

      const { scrollLeft = 0, scrollTop = 0 } = scrollEl || {};

      return {
        scrollEl,
        scrollLeft,
        scrollTop
      };
    },
    /**
     * 重载页面
     * @param duration - 重载的延迟时间(ms)
     */
    async reloadPage(duration = 0) {
      this.reloadFlag = false;
      await nextTick();
      if (duration) {
        setTimeout(() => {
          this.reloadFlag = true;
        }, duration);
      } else {
        this.reloadFlag = true;
      }
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 });
      }, 100);
    },
    /** 打开设置抽屉 */
    openSettingDrawer() {
      this.settingDrawerVisible = true;
    },
    /** 关闭设置抽屉 */
    closeSettingDrawer() {
      this.settingDrawerVisible = false;
    },
    /** 切换抽屉可见状态 */
    toggleSettingDrawerVisible() {
      this.settingDrawerVisible = !this.settingDrawerVisible;
    },
    /** 设置侧边栏折叠状态 */
    setSiderCollapse(collapse: boolean) {
      this.siderCollapse = collapse;
    },
    /** 折叠/展开 侧边栏折叠状态 */
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse;
    },
    /** 设置 vertical-mix模式下 侧边栏的固定状态 */
    setMixSiderIsFixed(isFixed: boolean) {
      this.mixSiderFixed = isFixed;
    },
    /** 设置 vertical-mix模式下 侧边栏的固定状态 */
    toggleMixSiderFixed() {
      this.mixSiderFixed = !this.mixSiderFixed;
    },
    /** 设置主体是否禁用滚动 */
    setDisableMainXScroll(disable: boolean) {
      this.disableMainXScroll = disable;
    },
    /** 设置主体内容全屏 */
    setContentFull(full: boolean) {
      this.contentFull = full;
    },
    /** 设置socket实例 */
    setSocket<T extends Socket = Socket>(socket: T) {
      this.socket = socket;
    }
  }
});
