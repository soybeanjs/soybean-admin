<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SConfigProvider } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import { useThemeStore } from '@/store/modules/theme';

/**
 * 应用根组件（ubean 的 `appRoot` 文件约定）。
 *
 * 框架出口（布局链 + 页面）从**默认插槽**注入，所以这里必须 `<slot />`：
 * 绝不渲染 `<PageView />`，否则会绕过布局链。
 *
 * 职责：放置「必须在布局之上」的全局上下文 —— Vean 的 `SConfigProvider`
 * （主题 / 组件文案 locale / 组件尺寸）。它同时自动挂载 `SProgressProvider`
 * 与 `SToastProvider`，因此应用里可直接用 `progress` / `toast`。
 *
 * 主题**不由本组件管理**：`SConfigProvider` 自己持有 base/primary/radius/mode，
 * 并由内部 watcher 把 `effectiveMode` 写成 `<html class="dark">`
 * （`theme.darkSelector: 'class'`）。消费方用 `useTheme()` 读改。
 *
 * 页面标题也在这里统一解析（守卫的 `useI18n()` 不可用）：`t(i18nKey) || title`
 * 的单一来源逻辑，路由/语言变化时自动更新 `document.title`。
 */
defineOptions({ name: 'AppRoot' });

const route = useRoute();
const themeStore = useThemeStore();
const { t, locale } = useI18n();

/**
 * 把应用 locale 直接交给 SConfigProvider 做组件文案 locale。
 *
 * `zh` / `en` 里**只有 `en` 是 Vean（`@vean/aria/locale`）出厂注册的 key**；
 * 中文出厂的 key 是 `zh-CN`，而未知 key 会被静默回落到 `en`。`zh` 的补注册
 * 在 `src/app.ts` 里通过 `registerVeanLocales()` 完成（见 `@/shared/vean-locale`）。
 */
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
</script>

<template>
  <SConfigProvider :theme="themeStore.configProviderTheme" :locale="veanLocale" persist-theme>
    <slot />
  </SConfigProvider>
</template>
