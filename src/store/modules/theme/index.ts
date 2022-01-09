import { ref, reactive, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import type { GlobalThemeOverrides, GlobalTheme } from 'naive-ui';
import { themeSetting } from '@/settings';
import { useBoolean } from '@/hooks';
import { getColorPalette } from '@/utils';
import type { ThemeSetting, ThemeHorizontalMenuPosition } from '@/interface';
import { getNaiveThemeOverrides, addThemeCssVarsToHtml } from './helpers';
import {
  useLayoutFunc,
  useHeaderFunc,
  useTabFunc,
  useSiderFunc,
  useFooterFunc,
  usePageFunc,
  osThemeWatcher,
  setupWindicssDarkMode,
  setupHiddenScroll,
  themeColorWatcher
} from './hooks';
import type { LayoutFunc, HeaderFunc, TabFunc, SiderFunc, FooterFunc, PageFunc } from './hooks';

type BuiltInGlobalTheme = Omit<Required<GlobalTheme>, 'InternalSelectMenu' | 'InternalSelection'>;

interface ThemeStore extends LayoutFunc, HeaderFunc, TabFunc, SiderFunc, FooterFunc, PageFunc {
  /** 暗黑模式 */
  darkMode: Ref<boolean>;
  /** 设置暗黑模式 */
  setDarkMode(dark: boolean): void;
  /** 切换/关闭 暗黑模式 */
  toggleDarkMode(dark: boolean): void;
  /** 布局样式 */
  layout: ThemeSetting['layout'];
  /** 主题颜色 */
  themeColor: Ref<string>;
  /** 设置系统主题颜色 */
  setThemeColor(color: string): void;
  /** 主题颜色列表 */
  themeColorList: string[];
  /** 其他颜色 */
  otherColor: ComputedRef<ThemeSetting['otherColor']>;
  /** 固定头部和多页签 */
  fixedHeaderAndTab: Ref<boolean>;
  /** 设置固定头部和多页签 */
  setIsFixedHeaderAndTab(isFixed: boolean): void;
  /** 重载按钮可见 */
  reloadVisible: Ref<boolean>;
  /** 设置 显示/隐藏 重载按钮 */
  setReloadVisible(visible: boolean): void;
  /** 头部 */
  header: ThemeSetting['header'];
  /** 多页签 */
  tab: ThemeSetting['tab'];
  /** 侧边栏 */
  sider: ThemeSetting['sider'];
  /** 菜单 */
  menu: ThemeSetting['menu'];
  /** 设置水平模式的菜单的位置 */
  setHorizontalMenuPosition(posiiton: ThemeHorizontalMenuPosition): void;
  /** 底部 */
  footer: ThemeSetting['footer'];
  /** 页面 */
  page: ThemeSetting['page'];
  /** naiveUI的主题配置 */
  naiveThemeOverrides: ComputedRef<GlobalThemeOverrides>;
  /** naive-ui暗黑主题 */
  naiveTheme: ComputedRef<BuiltInGlobalTheme | undefined>;
  /** 重置状态 */
  resetThemeStore(): void;
}

export const useThemeStore = defineStore('theme-store', () => {
  // 暗黑模式
  const { bool: darkMode, setBool: setDarkMode, toggle: toggleDarkMode } = useBoolean();

  // 布局
  const layout = reactive<ThemeSetting['layout']>({
    ...themeSetting.layout
  });
  const { setLayoutMinWidth, setLayoutMode } = useLayoutFunc(layout);

  // 主题色
  const themeColor = ref(themeSetting.themeColor);
  /** 设置系统主题颜色 */
  function setThemeColor(color: string) {
    themeColor.value = color;
  }
  const { themeColorList } = themeSetting;
  const otherColor = computed<ThemeSetting['otherColor']>(() => ({
    ...themeSetting.otherColor,
    info: getColorPalette(themeColor.value, 7)
  }));

  // 固定头部和多页签
  const { bool: fixedHeaderAndTab, setBool: setIsFixedHeaderAndTab } = useBoolean(themeSetting.fixedHeaderAndTab);

  // 重载按钮
  const { bool: reloadVisible, setBool: setReloadVisible } = useBoolean(themeSetting.showReload);

  // 头部
  const header = reactive<ThemeSetting['header']>({
    height: themeSetting.header.height,
    crumb: { ...themeSetting.header.crumb }
  });
  const { setHeaderHeight, setHeaderCrumbVisible, setHeaderCrumbIconVisible } = useHeaderFunc(header);

  // 多页签
  const tab = reactive<ThemeSetting['tab']>({
    ...themeSetting.tab
  });
  const { setTabVisible, setTabHeight, setTabMode, setTabIsCache } = useTabFunc(tab);

  // 侧边栏
  const sider = reactive<ThemeSetting['sider']>({
    ...themeSetting.sider
  });
  const {
    setSiderWidth,
    setSiderCollapsedWidth,
    setMixSiderWidth,
    setMixSiderCollapsedWidth,
    setMixSiderChildMenuWidth
  } = useSiderFunc(sider);

  // 菜单
  const menu = reactive<ThemeSetting['menu']>({
    ...themeSetting.menu
  });
  function setHorizontalMenuPosition(posiiton: ThemeHorizontalMenuPosition) {
    menu.horizontalPosition = posiiton;
  }

  // 底部
  const footer = reactive<ThemeSetting['footer']>({
    ...themeSetting.footer
  });
  const { setFooterIsFixed, setFooterHeight } = useFooterFunc(footer);

  // 页面
  const page = reactive<ThemeSetting['page']>({
    ...themeSetting.page
  });
  const { setPageIsAnimate, setPageAnimateMode } = usePageFunc(page);

  // naive主题
  const naiveThemeOverrides = computed<GlobalThemeOverrides>(() =>
    getNaiveThemeOverrides({ primary: themeColor.value, ...otherColor.value })
  );
  const naiveTheme = computed(() => (darkMode.value ? darkTheme : undefined));

  /** 重置theme状态 */
  function resetThemeStore() {
    setDarkMode(false);
  }

  /** 初始化css vars, 并添加至html */
  function initThemeCssVars() {
    const updatedThemeVars = { ...naiveThemeOverrides.value.common };
    addThemeCssVarsToHtml(updatedThemeVars);
  }

  /** 系统主题适应操作系统 */
  function handleAdaptOsTheme() {
    osThemeWatcher(isDark => {
      if (isDark) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    });
  }

  function init() {
    initThemeCssVars();
    handleAdaptOsTheme();
    setupWindicssDarkMode(darkMode);
    setupHiddenScroll(computed(() => layout.minWidth));
    themeColorWatcher(themeColor);
  }

  init();

  const themeStore: ThemeStore = {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    layout,
    setLayoutMinWidth,
    setLayoutMode,
    themeColor,
    setThemeColor,
    themeColorList,
    otherColor,
    fixedHeaderAndTab,
    setIsFixedHeaderAndTab,
    reloadVisible,
    setReloadVisible,
    header,
    setHeaderHeight,
    setHeaderCrumbVisible,
    setHeaderCrumbIconVisible,
    tab,
    setTabVisible,
    setTabHeight,
    setTabMode,
    setTabIsCache,
    sider,
    setSiderWidth,
    setSiderCollapsedWidth,
    setMixSiderWidth,
    setMixSiderCollapsedWidth,
    setMixSiderChildMenuWidth,
    menu,
    setHorizontalMenuPosition,
    footer,
    setFooterIsFixed,
    setFooterHeight,
    page,
    setPageIsAnimate,
    setPageAnimateMode,
    naiveThemeOverrides,
    naiveTheme,
    resetThemeStore
  };

  return themeStore;
});
