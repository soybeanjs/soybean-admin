import { EnumThemeTabMode, EnumThemeHorizontalMenuPosition, EnumThemeAnimateMode } from '@/enum';
import type { ThemeSetting } from '@/interface';

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

const defaultThemeSetting: ThemeSetting = {
  darkMode: false,
  layout: {
    minWidth: 900,
    mode: 'vertical'
  },
  themeColor: themeColorList[0],
  themeColorList,
  otherColor: {
    info: '#2080f0',
    success: '#67C23A',
    warning: '#E6A23C',
    error: '#F56C6C'
  },
  fixedHeaderAndTab: true,
  showReload: true,
  header: {
    height: 56,
    crumb: {
      visible: true,
      showIcon: true
    }
  },
  tab: {
    visible: true,
    height: 44,
    mode: 'chrome',
    modeList: [
      { value: 'chrome', label: EnumThemeTabMode.chrome },
      { value: 'button', label: EnumThemeTabMode.button }
    ],
    isCache: true
  },
  sider: {
    width: 200,
    collapsedWidth: 64,
    mixWidth: 80,
    mixCollapsedWidth: 48,
    mixChildMenuWidth: 200
  },
  menu: {
    horizontalPosition: 'flex-start',
    horizontalPositionList: [
      { value: 'flex-start', label: EnumThemeHorizontalMenuPosition['flex-start'] },
      { value: 'center', label: EnumThemeHorizontalMenuPosition.center },
      { value: 'flex-end', label: EnumThemeHorizontalMenuPosition['flex-end'] }
    ]
  },
  footer: {
    fixed: true,
    height: 48
  },
  page: {
    animate: true,
    animateMode: 'fade-slide',
    animateModeList: [
      { value: 'fade-slide', label: EnumThemeAnimateMode['fade-slide'] },
      { value: 'fade', label: EnumThemeAnimateMode.fade },
      { value: 'fade-bottom', label: EnumThemeAnimateMode['fade-bottom'] },
      { value: 'fade-scale', label: EnumThemeAnimateMode['fade-scale'] },
      { value: 'zoom-fade', label: EnumThemeAnimateMode['zoom-fade'] },
      { value: 'zoom-out', label: EnumThemeAnimateMode['zoom-out'] }
    ]
  }
};

export const themeSetting = defaultThemeSetting;
