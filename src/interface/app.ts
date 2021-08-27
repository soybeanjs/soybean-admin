export interface ThemeSettings {
  /** 深色模式 */
  darkMode: boolean;
  /** 主题颜色 */
  themeColor: string;
  /** 主题颜色列表 */
  themeColorList: string[];
  /** 其他颜色 */
  otherColor: OtherColor;
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
