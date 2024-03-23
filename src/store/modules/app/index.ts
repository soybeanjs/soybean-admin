import { effectScope, onScopeDispose, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { breakpointsTailwind, useBreakpoints, useTitle } from '@vueuse/core';
import { useBoolean } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { router } from '@/router';
import { $t, setLocale } from '@/locales';
import { setDayjsLocale } from '@/locales/dayjs';
import { localStg } from '@/utils/storage';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { useThemeStore } from '../theme';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const themeStore = useThemeStore();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const scope = effectScope();
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean();
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true);
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean();
  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean();
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean();
  const { bool: mixSiderFixed, setBool: setMixSiderFixed, toggle: toggleMixSiderFixed } = useBoolean();

  /** Is mobile layout */
  const isMobile = breakpoints.smaller('sm');

  /**
   * Reload page
   *
   * @param duration Duration time
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false);

    if (duration > 0) {
      await new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }

    setReloadFlag(true);
  }

  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  const localeOptions: App.I18n.LangOption[] = [
    {
      label: '中文',
      key: 'zh-CN'
    },
    {
      label: 'English',
      key: 'en-US'
    }
  ];

  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang;
    setLocale(lang);
    localStg.set('lang', lang);
  }

  /** Update document title by locale */
  function updateDocumentTitleByLocale() {
    const { i18nKey, title } = router.currentRoute.value.meta;

    const documentTitle = i18nKey ? $t(i18nKey) : title;

    useTitle(documentTitle);
  }

  function init() {
    setDayjsLocale(locale.value);
  }

  // watch store
  scope.run(() => {
    // watch isMobile, if is mobile, collapse sider
    watch(
      isMobile,
      newValue => {
        if (newValue) {
          setSiderCollapse(true);

          themeStore.setThemeLayout('vertical');
        }
      },
      { immediate: true }
    );

    // watch locale
    watch(locale, () => {
      // update document title by locale
      updateDocumentTitleByLocale();

      // update global menus by locale
      routeStore.updateGlobalMenusByLocale();

      // update tabs by locale
      tabStore.updateTabsByLocale();

      // sey dayjs locale
      setDayjsLocale(locale.value);
    });
  });

  /** On scope dispose */
  onScopeDispose(() => {
    scope.stop();
  });

  // init
  init();

  return {
    isMobile,
    reloadFlag,
    reloadPage,
    fullContent,
    locale,
    localeOptions,
    changeLocale,
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    toggleFullContent,
    contentXScrollable,
    setContentXScrollable,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    mixSiderFixed,
    setMixSiderFixed,
    toggleMixSiderFixed
  };
});
