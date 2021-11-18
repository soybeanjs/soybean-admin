import { computed } from 'vue';
import { useThemeStore, useAppStore } from '@/store';

export function useLayoutConfig() {
  const theme = useThemeStore();
  const app = useAppStore();

  /** 反转sider */
  const siderInverted = computed(() => theme.navStyle.theme !== 'light');

  /** 侧边菜单宽度 */
  const siderMenuWidth = computed(() => {
    const { collapsed } = app.menu;
    const { collapsedWidth, width } = theme.menuStyle;
    return collapsed ? collapsedWidth : width;
  });

  /** 反转header */
  const headerInverted = computed(() => (theme.navStyle.theme !== 'dark' ? siderInverted.value : !siderInverted.value));

  /** 头部定位 */
  const headerPosition = computed(() => (theme.fixedHeaderAndTab ? 'absolute' : 'static'));

  /** 全局头部的高度(px) */
  const headerHeight = computed(() => `${theme.headerStyle.height}px`);

  /** 多页签Tab的高度(px) */
  const multiTabHeight = computed(() => `${theme.multiTabStyle.height}px`);

  /** 全局头部和多页签的总高度 */
  const headerAndMultiTabHeight = computed(() => {
    const {
      multiTabStyle: { visible, height: tH },
      headerStyle: { height: hH }
    } = theme;
    const height = visible ? tH + hH : hH;
    return `${height}px`;
  });

  return {
    siderInverted,
    siderMenuWidth,
    headerInverted,
    headerPosition,
    headerHeight,
    multiTabHeight,
    headerAndMultiTabHeight
  };
}
