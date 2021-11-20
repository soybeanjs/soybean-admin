import type { ThemeSettings } from '@/interface';
import { EnumAnimate, EnumMultiTabMode, EnumHorizontalMenuPosition } from '@/enum';
import customThemeSettings from './theme.json';

const themeColorList = [
  '#409EFF',
  '#2d8cf0',
  '#0960bd',
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

const defaultThemeSettings: ThemeSettings = {
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
  menuStyle: {
    width: 200,
    collapsedWidth: 64,
    mixWidth: 80,
    mixCollapsedWidth: 48,
    horizontalPosition: 'flex-start',
    horizontalPositionList: [
      { value: 'flex-start', label: EnumHorizontalMenuPosition['flex-start'] },
      { value: 'center', label: EnumHorizontalMenuPosition.center },
      { value: 'flex-end', label: EnumHorizontalMenuPosition['flex-end'] }
    ]
  },
  headerStyle: {
    height: 56,
    bgColor: '#fff'
  },
  multiTabStyle: {
    height: 44,
    visible: true,
    bgColor: '#fff',
    mode: 'chrome',
    isCache: true,
    modeList: [
      { value: 'button', label: EnumMultiTabMode.button },
      { value: 'chrome', label: EnumMultiTabMode.chrome }
    ]
  },
  crumbsStyle: {
    visible: true,
    showIcon: true
  },
  footerStyle: {
    height: 48
  },
  pageStyle: {
    animate: true,
    animateType: 'fade-slide',
    animateTypeList: [
      { value: 'zoom-fade', label: EnumAnimate['zoom-fade'] },
      { value: 'zoom-out', label: EnumAnimate['zoom-out'] },
      { value: 'fade-slide', label: EnumAnimate['fade-slide'] },
      { value: 'fade', label: EnumAnimate.fade },
      { value: 'fade-bottom', label: EnumAnimate['fade-bottom'] },
      { value: 'fade-scale', label: EnumAnimate['fade-scale'] }
    ]
  },
  fixedHeaderAndTab: true,
  showReload: true
};

export const themeSettings = (customThemeSettings as ThemeSettings) || defaultThemeSettings;

export { defaultThemeSettings };
