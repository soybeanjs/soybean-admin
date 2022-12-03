import { EnumThemeAnimateMode, EnumThemeHorizontalMenuPosition, EnumThemeLayoutMode, EnumThemeTabMode } from '@/enum';
import jsonSetting from './theme.json';

const themeColorList = [
  '#1890ff',
  '#409EFF',
  '#2d8cf0',
  '#007AFF',
  '#5ac8fa',
  '#5856D6',
  '#536dfe',
  '#9c27b0',
  '#AF52DE',
  '#0096c7',
  '#00C1D4',
  '#34C759',
  '#43a047',
  '#7cb342',
  '#c0ca33',
  '#78DEC7',
  '#e53935',
  '#d81b60',
  '#f4511e',
  '#fb8c00',
  '#ffb300',
  '#fdd835',
  '#6d4c41',
  '#546e7a'
];

const defaultThemeSetting: Theme.Setting = {
  darkMode: false,
  followSystemTheme: true,
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
  isCustomizeInfoColor: false,
  fixedHeaderAndTab: true,
  showReload: true,
  header: {
    inverted: false,
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
    inverted: false,
    width: 220,
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
    height: 48,
    visible: true
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

export const themeSetting = (jsonSetting as Theme.Setting) || defaultThemeSetting;
