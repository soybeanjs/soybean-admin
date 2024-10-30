/** Default theme settings */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: 'light',
  grayscale: false,
  colourWeakness: false,
  recommendColor: false,
  themeColor: '#646cff',
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  isInfoFollowPrimary: true,
  resetCacheStrategy: 'close',
  layout: {
    mode: 'vertical',
    scrollMode: 'content',
    reverseHorizontalMix: false
  },
  page: {
    animate: true,
    animateMode: 'fade-slide'
  },
  header: {
    height: 56,
    breadcrumb: {
      visible: true,
      showIcon: true
    }
  },
  tab: {
    visible: true,
    cache: true,
    height: 44,
    mode: 'chrome'
  },
  fixedHeaderAndTab: true,
  sider: {
    inverted: false,
    width: 220,
    collapsedWidth: 64,
    mixWidth: 90,
    mixCollapsedWidth: 64,
    mixChildMenuWidth: 200
  },
  footer: {
    visible: true,
    fixed: false,
    height: 48,
    right: true
  },
  watermark: {
    visible: false,
    text: 'SoybeanAdmin'
  },
  tokens: {
    light: {
      colors: {
        container: 'rgb(255, 255, 255)',
        layout: 'rgb(247, 250, 252)',
        inverted: 'rgb(0, 20, 40)',
        'base-text': 'rgb(31, 31, 31)'
      },
      boxShadow: {
        header: '0 1px 2px rgb(0, 21, 41, 0.08)',
        sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
        tab: '0 1px 2px rgb(0, 21, 41, 0.08)'
      }
    },
    dark: {
      colors: {
        container: 'rgb(28, 28, 28)',
        layout: 'rgb(18, 18, 18)',
        'base-text': 'rgb(224, 224, 224)'
      }
    }
  }
};

/**
 * Override theme settings
 *
 * If publish new version, use `overrideThemeSettings` to override certain theme settings
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {
  resetCacheStrategy: 'close',
  watermark: {
    visible: false,
    text: 'SoybeanAdmin'
  }
};

/**
 * Configure theme using .env environment variables
 *
 * Add by woeoio@qq.com
 */
export const envThemeSettings: Partial<App.Theme.ThemeSetting> = {
  // Theme Scheme
  themeScheme: import.meta.env.VITE_THEME_SCHEME || themeSettings.themeScheme,

  // Grayscale
  grayscale: import.meta.env.VITE_THEME_GRAYSCALE
    ? import.meta.env.VITE_THEME_GRAYSCALE === 'true'
    : themeSettings.grayscale,

  // Recommend Color
  recommendColor: import.meta.env.VITE_THEME_RECOMMEND_COLOR
    ? import.meta.env.VITE_THEME_RECOMMEND_COLOR === 'true'
    : themeSettings.recommendColor,

  // Theme Color
  themeColor: import.meta.env.VITE_THEME_COLOR || themeSettings.themeColor,

  // Other Colors
  otherColor: {
    info: import.meta.env.VITE_THEME_COLOR_INFO || themeSettings.otherColor.info,
    success: import.meta.env.VITE_THEME_COLOR_SUCCESS || themeSettings.otherColor.success,
    warning: import.meta.env.VITE_THEME_COLOR_WARNING || themeSettings.otherColor.warning,
    error: import.meta.env.VITE_THEME_COLOR_ERROR || themeSettings.otherColor.error
  },

  // Info Follow Primary
  isInfoFollowPrimary: import.meta.env.VITE_THEME_INFO_FOLLOW_PRIMARY
    ? import.meta.env.VITE_THEME_INFO_FOLLOW_PRIMARY === 'true'
    : themeSettings.isInfoFollowPrimary,

  // Layout
  layout: {
    mode: import.meta.env.VITE_THEME_LAYOUT_MODE || themeSettings.layout.mode,
    scrollMode: import.meta.env.VITE_THEME_SCROLL_MODE || themeSettings.layout.scrollMode
  },

  // Page Animation
  page: {
    animate: import.meta.env.VITE_THEME_PAGE_ANIMATE
      ? import.meta.env.VITE_THEME_PAGE_ANIMATE === 'true'
      : themeSettings.page.animate,
    animateMode: import.meta.env.VITE_THEME_PAGE_ANIMATE_MODE || themeSettings.page.animateMode
  },

  // Header
  header: {
    height: Number(import.meta.env.VITE_THEME_HEADER_HEIGHT) || themeSettings.header.height,
    breadcrumb: {
      visible: import.meta.env.VITE_THEME_BREADCRUMB_VISIBLE
        ? import.meta.env.VITE_THEME_BREADCRUMB_VISIBLE === 'true'
        : themeSettings.header.breadcrumb.visible,
      showIcon: import.meta.env.VITE_THEME_BREADCRUMB_SHOW_ICON
        ? import.meta.env.VITE_THEME_BREADCRUMB_SHOW_ICON === 'true'
        : themeSettings.header.breadcrumb.showIcon
    }
  },

  // Tab
  tab: {
    visible: import.meta.env.VITE_THEME_TAB_VISIBLE
      ? import.meta.env.VITE_THEME_TAB_VISIBLE === 'true'
      : themeSettings.tab.visible,
    cache: import.meta.env.VITE_THEME_TAB_CACHE
      ? import.meta.env.VITE_THEME_TAB_CACHE === 'true'
      : themeSettings.tab.cache,
    height: Number(import.meta.env.VITE_THEME_TAB_HEIGHT) || themeSettings.tab.height,
    mode: import.meta.env.VITE_THEME_TAB_MODE || themeSettings.tab.mode
  },

  // Fixed Header and Tab
  fixedHeaderAndTab: import.meta.env.VITE_THEME_FIXED_HEADER_AND_TAB
    ? import.meta.env.VITE_THEME_FIXED_HEADER_AND_TAB === 'true'
    : themeSettings.fixedHeaderAndTab,

  // Sider
  sider: {
    inverted: import.meta.env.VITE_THEME_SIDER_INVERTED
      ? import.meta.env.VITE_THEME_SIDER_INVERTED === 'true'
      : themeSettings.sider.inverted,
    width: Number(import.meta.env.VITE_THEME_SIDER_WIDTH) || themeSettings.sider.width,
    collapsedWidth: Number(import.meta.env.VITE_THEME_SIDER_COLLAPSED_WIDTH) || themeSettings.sider.collapsedWidth,
    mixWidth: Number(import.meta.env.VITE_THEME_SIDER_MIX_WIDTH) || themeSettings.sider.mixWidth,
    mixCollapsedWidth:
      Number(import.meta.env.VITE_THEME_SIDER_MIX_COLLAPSED_WIDTH) || themeSettings.sider.mixCollapsedWidth,
    mixChildMenuWidth:
      Number(import.meta.env.VITE_THEME_SIDER_MIX_CHILD_MENU_WIDTH) || themeSettings.sider.mixChildMenuWidth
  },

  // Footer
  footer: {
    visible: import.meta.env.VITE_THEME_FOOTER_VISIBLE
      ? import.meta.env.VITE_THEME_FOOTER_VISIBLE === 'true'
      : themeSettings.footer.visible,
    fixed: import.meta.env.VITE_THEME_FOOTER_FIXED
      ? import.meta.env.VITE_THEME_FOOTER_FIXED === 'true'
      : themeSettings.footer.fixed,
    height: Number(import.meta.env.VITE_THEME_FOOTER_HEIGHT) || themeSettings.footer.height,
    right: import.meta.env.VITE_THEME_FOOTER_RIGHT
      ? import.meta.env.VITE_THEME_FOOTER_RIGHT === 'true'
      : themeSettings.footer.right
  }
};

/** .env variables */
// VITE_THEME_SCHEME=dark
// VITE_THEME_GRAYSCALE=true
// VITE_THEME_RECOMMEND_COLOR=true
// VITE_THEME_COLOR=#409EFF
// VITE_THEME_COLOR_INFO=#2080f0
// VITE_THEME_COLOR_SUCCESS=#52c41a
// VITE_THEME_COLOR_WARNING=#faad14
// VITE_THEME_COLOR_ERROR=#f5222d
// VITE_THEME_INFO_FOLLOW_PRIMARY=true
// VITE_THEME_LAYOUT_MODE=vertical
// VITE_THEME_SCROLL_MODE=content
// VITE_THEME_PAGE_ANIMATE=true
// VITE_THEME_PAGE_ANIMATE_MODE=fade-slide
// VITE_THEME_HEADER_HEIGHT=60
// VITE_THEME_BREADCRUMB_VISIBLE=true
// VITE_THEME_BREADCRUMB_SHOW_ICON=true
// VITE_THEME_TAB_VISIBLE=false
// VITE_THEME_TAB_CACHE=true
// VITE_THEME_TAB_HEIGHT=44
// VITE_THEME_TAB_MODE=chrome
// VITE_THEME_FIXED_HEADER_AND_TAB=true
// VITE_THEME_SIDER_INVERTED=false
// VITE_THEME_SIDER_WIDTH=220
// VITE_THEME_SIDER_COLLAPSED_WIDTH=64
// VITE_THEME_SIDER_MIX_WIDTH=90
// VITE_THEME_SIDER_MIX_COLLAPSED_WIDTH=64
// VITE_THEME_SIDER_MIX_CHILD_MENU_WIDTH=200
// VITE_THEME_FOOTER_VISIBLE=true
// VITE_THEME_FOOTER_FIXED=false
// VITE_THEME_FOOTER_HEIGHT=48
// VITE_THEME_FOOTER_RIGHT=true
