import { EnumAnimate, EnumNavMode, EnumNavTheme, EnumMultiTabMode, EnumHorizontalMenuPosition } from '@/enum';

export interface ThemeSettings {
  /** 深色模式 */
  darkMode: boolean;
  /** 主题颜色 */
  themeColor: string;
  /** 主题颜色列表 */
  themeColorList: string[];
  /** 其他颜色 */
  otherColor: OtherColor;
  /** 导航样式 */
  navStyle: NavStyle;
  /** 菜单样式 */
  menuStyle: MenuStyle;
  /** 头部样式 */
  headerStyle: HeaderStyle;
  /** 多页签样式 */
  multiTabStyle: MultiTabStyle;
  /** 面包屑样式 */
  crumbsStyle: CrumbsStyle;
  /** 底部样式 */
  footerStyle: FooterStyle;
  /** 页面样式 */
  pageStyle: PageStyle;
  /** 固定头部和多页签 */
  fixedHeaderAndTab: boolean;
  /** 显示重载按钮 */
  showReload: boolean;
}

interface OtherColor {
  /** 信息 */
  info: string;
  /** 成功 */
  success: string;
  /** 警告 */
  warning: string;
  /** 错误 */
  error: string;
}

export type NavMode = keyof typeof EnumNavMode;

type NavTheme = keyof typeof EnumNavTheme;

interface NavStyle {
  /** 导航模式 */
  mode: NavMode;
  /** 导航主题 */
  theme: NavTheme;
}

interface HeaderStyle {
  /** 顶部高度 */
  height: number;
  /** 背景颜色 */
  bgColor: string;
}

export type HorizontalMenuPosition = keyof typeof EnumHorizontalMenuPosition;

interface HorizontalMenuPositionList {
  value: HorizontalMenuPosition;
  label: EnumHorizontalMenuPosition;
}

interface MenuStyle {
  /** 菜单宽度 */
  width: number;
  /** 菜单折叠时的宽度 */
  collapsedWidth: number;
  /** 混合菜单的宽度 */
  mixWidth: number;
  /** 混合菜单折叠时的宽度 */
  mixCollapsedWidth: number;
  /** 水平模式的菜单的位置 */
  horizontalPosition: HorizontalMenuPosition;
  /** 水平模式的菜单的位置列表 */
  horizontalPositionList: HorizontalMenuPositionList[];
}

export type MultiTabMode = keyof typeof EnumMultiTabMode;

interface MultiTabModeList {
  value: MultiTabMode;
  label: EnumMultiTabMode;
}

interface MultiTabStyle {
  /** 多页签高度 */
  height: number;
  /** 多页签可见 */
  visible: boolean;
  /** 背景颜色 */
  bgColor: string;
  /** 多页签模式 */
  mode: MultiTabMode;
  /** 开启多页签缓存 */
  isCache: boolean;
  /** 多页签模式列表 */
  modeList: MultiTabModeList[];
}

interface CrumbsStyle {
  /** 面包屑可见 */
  visible: boolean;
  /** 显示图标 */
  showIcon: boolean;
}

interface FooterStyle {
  /** 底部高度 */
  height: number;
}

export type AnimateType = keyof typeof EnumAnimate;

interface AnimateTypeList {
  value: AnimateType;
  label: EnumAnimate;
}

interface PageStyle {
  /** 页面是否开启动画 */
  animate: boolean;
  /** 动画类型 */
  animateType: AnimateType;
  /** 动画类型列表 */
  animateTypeList: AnimateTypeList[];
}
