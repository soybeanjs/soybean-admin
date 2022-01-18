import { EnumThemeLayoutMode, EnumThemeTabMode, EnumThemeHorizontalMenuPosition, EnumThemeAnimateMode } from '@/enum';
import type { ThemeSetting } from '@/interface';

const themeColorList = [
  '#1890ff',
  '#007AFF',
  '#2d8cf0',
  '#409EFF',
  '#536dfe',
  '#5856D6',
  '#0096c7',
  '#00C1D4',
  '#009688',
  '#5AC8FA',
  '#34C759',
  '#71EFA3',
  '#78DEC7',
  '#FC5404',
  '#ee4f12',
  '#FF9500',
  '#fadb14',
  '#FFCC00',
  '#FF3B30',
  '#FF2D55',
  '#ff5c93',
  '#9c27b0',
  '#AF52DE'
];

const defaultThemeSetting: ThemeSetting = {
  darkMode: false,
  layout: {
    minWidth: 900,
    mode: 'vertical',
    modeList: [
      { value: 'vertical', label: EnumThemeLayoutMode.vertical },
      { value: 'vertical-mix', label: EnumThemeLayoutMode['vertical-mix'] },
      { value: 'horizontal', label: EnumThemeLayoutMode.horizontal },
      { value: 'horizontal-mix', label: EnumThemeLayoutMode['horizontal-mix'] }
    ]
  },
  themeColor: themeColorList[0],
  themeColorList,
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
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
    fixed: false,
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
