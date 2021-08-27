import type { ThemeSettings } from '@/interface';

const themeColorList = [
  '#409EFF',
  '#2d8cf0',
  '#0960bd',
  '#0084f4',
  '#009688',
  '#536dfe',
  '#ff5c93',
  '#ee4f12',
  '#0096c7',
  '#9c27b0',
  '#ff9800',
  '#FF3D68',
  '#00C1D4',
  '#71EFA3',
  '#171010',
  '#78DEC7',
  '#1768AC',
  '#FB9300',
  '#FC5404'
];

const themeSettings: ThemeSettings = {
  /** 深色主题 */
  darkMode: false,
  /** 系统主题色 */
  themeColor: themeColorList[0],
  /** 系统内置主题色列表 */
  themeColorList,
  /** 其他颜色 */
  otherColor: {
    info: '#2080f0',
    success: '#67C23A',
    warning: '#E6A23C',
    error: '#F56C6C'
  }
};

export default themeSettings;
