<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SConfigProvider } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import { syncDocumentLocale } from '@/shared/i18n';
import { useThemeStore } from '@/store/modules/theme';
import GlobalSearch from '@/components/global-search/index.vue';
import GlobalWatermark from '@/components/global-watermark/index.vue';
import ThemeBridge from '@/components/theme-bridge.vue';
import ThemeDrawer from '@/components/theme-drawer/index.vue';

/** 框架出口（布局链 + 页面）从**默认插槽**注入，所以这里必须 `<slot />`： 详见 docs/v3-notes.md N-004。 */
defineOptions({ name: 'AppRoot' });

const route = useRoute();
const themeStore = useThemeStore();
const { t, locale } = useI18n();

/** 把应用 locale 直接交给 SConfigProvider 做组件文案 locale 详见 docs/v3-notes.md N-005。 */
const veanLocale = computed(() => locale.value);

/** 标题单一来源：`t(meta.i18nKey) || meta.title`（无则回落应用名）。
 * RouteMeta 已在 app.d.ts 全局扩展为 AppRouteMeta，直接读扩展字段 */
const documentTitle = computed(() => {
  const meta = route.meta;
  const title = (meta.i18nKey ? t(meta.i18nKey) : '') || meta.title || '';

  return title ? `${title} | ${APP_TITLE}` : APP_TITLE;
});

watch(
  documentTitle,
  title => {
    if (typeof document !== 'undefined') document.title = title;
  },
  { immediate: true }
);

/** locale → `<html lang>` / `<html dir>` 同步 详见 docs/v3-notes.md N-006。 */
watch(locale, syncDocumentLocale, { immediate: true });

/** 灰色 / 色弱滤镜（P2-10）写在 `<html>` 上 详见 docs/v3-notes.md N-007。 */
watch(
  // pinia store 实例上的 ref 会被解包，`store.filterStyle` 本身是值而不是
  // WatchSource —— 必须包成 getter 才能被 `watch` 追踪。
  () => themeStore.filterStyle,
  value => {
    if (typeof document === 'undefined') return;

    document.documentElement.style.filter = value ?? '';
  },
  { immediate: true }
);
</script>

<template>
  <SConfigProvider :locale="veanLocale" persist-theme>
    <ThemeBridge>
      <slot />
      <GlobalWatermark />
      <ThemeDrawer />
      <GlobalSearch />
    </ThemeBridge>
  </SConfigProvider>
</template>
