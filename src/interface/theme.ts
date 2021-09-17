import { EnumAnimate, EnumNavMode, EnumNavTheme } from '@/enum';

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
  /** 多标签样式 */
  multiTabStyle: MultiTabStyle;
  /** 面包屑样式 */
  crumbsStyle: CrumbsStyle;
  /** 页面样式 */
  pageStyle: PageStyle;
  /** 固定头部和多标签 */
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

interface MenuStyle {
  /** 菜单宽度 */
  width: number;
  /** 混合菜单的宽度 */
  mixWidth: number;
  /** 菜单折叠时的宽度 */
  collapsedWidth: number;
  /** 固定菜单 */
  fixed: boolean;
  /** 分割菜单 */
  splitMenu: boolean;
}

interface MultiTabStyle {
  /** 多标签高度 */
  height: number;
  /** 多标签可见 */
  visible: boolean;
  /** 背景颜色 */
  bgColor: string;
}

interface CrumbsStyle {
  /** 面包屑可见 */
  visible: boolean;
  /** 显示图标 */
  showIcon: boolean;
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
