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
  darkMode: false,
  themeColor: themeColorList[0],
  themeColorList,
  otherColor: {
    info: '#2080f0',
    success: '#67C23A',
    warning: '#E6A23C',
    error: '#F56C6C'
  },
  navStyle: {
    mode: 'vertical',
    theme: 'light'
  },
  headerStyle: {
    height: 64,
    bgColor: '#fff',
    fixed: true,
    showReload: true
  },
  menuStyle: {
    collapsed: false,
    width: 200,
    collapsedWidth: 64,
    fixed: true,
    splitMenu: false
  },
  multiTabStyle: {
    visible: true,
    bgColor: '#fff',
    fixed: true
  },
  crumbsStyle: {
    visible: true,
    showIcon: false
  },
  pageStyle: {
    animate: true,
    animateType: 'zoom-fade'
  }
};

export default themeSettings;
