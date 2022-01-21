import {
  EnumLayoutComponentName,
  EnumThemeLayoutMode,
  EnumThemeTabMode,
  EnumThemeHorizontalMenuPosition,
  EnumThemeAnimateMode,
  EnumLoginModule
} from '@/enum';

/** 布局组件名称 */
export type LayoutComponentName = keyof typeof EnumLayoutComponentName;

/** 布局模式 */
export type ThemeLayoutMode = keyof typeof EnumThemeLayoutMode;

/** 多页签风格 */
export type ThemeTabMode = keyof typeof EnumThemeTabMode;

/** 水平模式的菜单位置 */
export type ThemeHorizontalMenuPosition = keyof typeof EnumThemeHorizontalMenuPosition;

/** 过渡动画 */
export type ThemeAnimateMode = keyof typeof EnumThemeAnimateMode;

/** 登录模块 */
export type LoginModuleKey = keyof typeof EnumLoginModule;
