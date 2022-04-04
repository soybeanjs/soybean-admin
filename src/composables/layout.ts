import { computed } from 'vue';
import { useAppStore, useThemeStore } from '@/store';

type LayoutHeaderProps = Record<EnumType.ThemeLayoutMode, GlobalHeaderProps>;

export function useBasicLayout() {
  const app = useAppStore();
  const theme = useThemeStore();

  type LayoutMode = 'vertical' | 'horizontal';
  const mode = computed(() => {
    const vertical: LayoutMode = 'vertical';
    const horizontal: LayoutMode = 'horizontal';
    return theme.layout.mode.includes(vertical) ? vertical : horizontal;
  });

  const layoutHeaderProps: LayoutHeaderProps = {
    vertical: {
      showLogo: false,
      showHeaderMenu: false,
      showMenuCollapse: true
    },
    'vertical-mix': {
      showLogo: false,
      showHeaderMenu: false,
      showMenuCollapse: false
    },
    horizontal: {
      showLogo: true,
      showHeaderMenu: true,
      showMenuCollapse: false
    },
    'horizontal-mix': {
      showLogo: true,
      showHeaderMenu: false,
      showMenuCollapse: true
    }
  };

  const headerProps = computed(() => layoutHeaderProps[theme.layout.mode]);

  const siderVisible = computed(() => theme.layout.mode !== 'horizontal');
  const siderWidth = computed(() => {
    const { width, mixWidth, mixChildMenuWidth } = theme.sider;
    const isVerticalMix = theme.layout.mode === 'vertical-mix';
    let w = isVerticalMix ? mixWidth : width;
    if (isVerticalMix && app.mixSiderFixed) {
      w += mixChildMenuWidth;
    }
    return w;
  });
  const siderCollapsedWidth = computed(() => {
    const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = theme.sider;
    const isVerticalMix = theme.layout.mode === 'vertical-mix';
    let w = isVerticalMix ? mixCollapsedWidth : collapsedWidth;
    if (isVerticalMix && app.mixSiderFixed) {
      w += mixChildMenuWidth;
    }
    return w;
  });

  return {
    mode,
    headerProps,
    siderVisible,
    siderWidth,
    siderCollapsedWidth
  };
}
