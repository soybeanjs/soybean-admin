import { EnumThemeLayoutMode, EnumThemeTabMode, EnumThemeHorizontalMenuPosition, EnumThemeAnimateMode } from '@/enum';
import type { ThemeLayoutMode, ThemeTabMode, ThemeHorizontalMenuPosition, ThemeAnimateMode } from './enum';

/** 主题相关类型 */
export interface ThemeSetting {
  /** 暗黑模式 */
  darkMode: boolean;
  /** 布局样式 */
  layout: ThemeLayout;
  /** 主题颜色 */
  themeColor: string;
  /** 主题颜色列表 */
  themeColorList: string[];
  /** 其他颜色 */
  otherColor: ThemeOtherColor;
  /** 是否自定义info的颜色(默认取比主题色深一级的颜色) */
  isCustomizeInfoColor: boolean;
  /** 固定头部和多页签 */
  fixedHeaderAndTab: boolean;
  /** 显示重载按钮 */
  showReload: boolean;
  /** 头部样式 */
  header: ThemeHeader;
  /** 标多页签样式 */
  tab: ThemeTab;
  /** 侧边栏样式 */
  sider: ThemeSider;
  /** 菜单样式 */
  menu: ThemeMenu;
  /** 底部样式 */
  footer: ThemeFooter;
  /** 页面样式 */
  page: ThemePage;
}

/** 布局样式 */
interface ThemeLayout {
  /** 最小宽度 */
  minWidth: number;
  /** 布局模式 */
  mode: ThemeLayoutMode;
  /** 布局模式列表 */
  modeList: ThemeLayoutModeList[];
}
interface ThemeLayoutModeList {
  value: ThemeLayoutMode;
  label: EnumThemeLayoutMode;
}

/** 其他主题颜色 */
interface ThemeOtherColor {
  /** 信息 */
  info: string;
  /** 成功 */
  success: string;
  /** 警告 */
  warning: string;
  /** 错误 */
  error: string;
}

/** 头部样式 */
interface ThemeHeader {
  /** 头部高度 */
  height: number;
  /** 面包屑样式 */
  crumb: ThemeCrumb;
}
/** 面包屑样式 */
interface ThemeCrumb {
  /** 面包屑可见 */
  visible: boolean;
  /** 显示图标 */
  showIcon: boolean;
}

/** 标多页签样式 */
export interface ThemeTab {
  /** 多页签可见 */
  visible: boolean;
  /** 多页签高度 */
  height: number;
  /** 多页签风格 */
  mode: ThemeTabMode;
  /** 多页签风格列表 */
  modeList: ThemeTabModeList[];
  /** 开启多页签缓存 */
  isCache: boolean;
}

/** 多页签风格列表 */
interface ThemeTabModeList {
  value: ThemeTabMode;
  label: EnumThemeTabMode;
}

/** 侧边栏样式 */
interface ThemeSider {
  /** 侧边栏宽度 */
  width: number;
  /** 侧边栏折叠时的宽度 */
  collapsedWidth: number;
  /** vertical-mix模式下侧边栏宽度 */
  mixWidth: number;
  /** vertical-mix模式下侧边栏折叠时的宽度 */
  mixCollapsedWidth: number;
  /** vertical-mix模式下侧边栏的子菜单的宽度 */
  mixChildMenuWidth: number;
}

/** 菜单样式 */
interface ThemeMenu {
  /** 水平模式的菜单的位置 */
  horizontalPosition: ThemeHorizontalMenuPosition;
  /** 水平模式的菜单的位置列表 */
  horizontalPositionList: ThemeHorizontalMenuPositionList[];
}
/** 水平模式的菜单的位置列表 */
interface ThemeHorizontalMenuPositionList {
  value: ThemeHorizontalMenuPosition;
  label: EnumThemeHorizontalMenuPosition;
}

/** 底部样式 */
interface ThemeFooter {
  /** 是否固定底部 */
  fixed: boolean;
  /** 底部高度 */
  height: number;
}

/** 页面样式 */
interface ThemePage {
  /** 页面是否开启动画 */
  animate: boolean;
  /** 动画类型 */
  animateMode: ThemeAnimateMode;
  /** 动画类型列表 */
  animateModeList: ThemeAnimateModeList[];
}
/** 动画类型列表 */
interface ThemeAnimateModeList {
  value: ThemeAnimateMode;
  label: EnumThemeAnimateMode;
}
