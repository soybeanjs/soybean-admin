import { effectScope, onScopeDispose, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEventListener } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useTabStore, useThemeStore } from '@/store';

/** 全局事件 */
export function useGlobalEvents() {
  const theme = useThemeStore();
  const tab = useTabStore();
  const route = useRoute();
  const { locale, t } = useI18n();
  const scope = effectScope();

  /** 页面离开时缓存多页签数据 */
  useEventListener(window, 'beforeunload', () => {
    theme.cacheThemeSettings();
    tab.cacheTabRoutes();
  });

  scope.run(() => {
    // 国际化切换时更新浏览器标签文本
    watch(
      () => locale.value,
      () => {
        document.title = route.meta.i18nTitle ? t(route.meta.i18nTitle) : route.meta.title;
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });
}
