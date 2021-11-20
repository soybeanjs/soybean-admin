import { ref, computed, watch } from 'vue';
import type { ScrollbarInst } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useRouteProps } from './route';

export function useLayoutConfig() {
  const theme = useThemeStore();
  const app = useAppStore();
  const { setScrollbarInstance } = useAppStore();
  const routeProps = useRouteProps();

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
      multiTabStyle: { visible, height: tabHeight },
      headerStyle: { height: headerHeight }
    } = theme;
    const height = visible ? headerHeight + tabHeight : headerHeight;
    return `${height}px`;
  });

  /** 全局侧边栏的样式 */
  const globalSiderClassAndStyle = {
    class: 'transition-all duration-300 ease-in-out',
    style: 'z-index:12;box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);'
  };

  /** 纵向flex布局样式 */
  const flexColumnStyle = 'display:flex;flex-direction:column;height:100%;';

  /** scrollbar的content的样式 */
  const scrollbarContentStyle = computed(() => {
    const { fullPage } = routeProps.value;
    const height = fullPage ? '100%' : 'auto';
    return `display:flex;flex-direction:column;height:${height};min-height:100%;`;
  });

  /** 滚动条实例 */
  const scrollbar = ref<ScrollbarInst | null>(null);

  watch(scrollbar, newValue => {
    if (newValue) {
      setScrollbarInstance(newValue);
    }
  });

  return {
    siderInverted,
    siderMenuWidth,
    headerInverted,
    headerPosition,
    headerHeight,
    multiTabHeight,
    headerAndMultiTabHeight,
    globalSiderClassAndStyle,
    flexColumnStyle,
    scrollbarContentStyle,
    scrollbar
  };
}
