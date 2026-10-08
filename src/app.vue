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

/**
 * 应用根组件（ubean 的 `appRoot` 文件约定）。
 *
 * 框架出口（布局链 + 页面）从**默认插槽**注入，所以这里必须 `<slot />`：
 * 绝不渲染 `<PageView />`，否则会绕过布局链。
 *
 * 职责：放置「必须在布局之上」的全局上下文与全局浮层 ——
 *
 * - `SConfigProvider`：主题 / 组件文案 locale / 组件尺寸。它同时自动挂载
 *   `SProgressProvider`、`SToastProvider` 与 `SDialogProvider`，因此应用里可直接
 *   用 `progress` / `toast` / `dialog`，不需要再手写 `<SDialogProvider />`。
 * - `ThemeBridge`：主题真值的桥（必须在 provider **内部**，见其文件头）。
 * - 全局水印 / 主题抽屉 / 全局搜索：与布局无关的浮层，登录页也应在。
 *
 * 主题**不由本组件下发**：provider 的主题派生是 `props.theme.base ?? themeState.base`
 * （`use-theme.ts`），传一个 store 派生的响应式 `:theme` 会让它永久压过
 * `SThemeCustomizer` 的编辑 —— 抽屉里改色毫无反应。所以初值只在 `src/app.ts`
 * 里 `seedPresetState()` 种进 `__VEAN_THEME` 信封一次，之后真值全在 provider
 * 内部（`persist-theme` 负责持久化），本组件只把明暗偏好镜像回 store。
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

/**
 * locale → `<html lang>` / `<html dir>` 同步。
 *
 * `defineApp({ head: { htmlAttrs } })` 是构建期静态值，切语言不会变；屏幕阅读器
 * 的朗读语言、浏览器翻译提示、CSS `:lang()` 都要靠这里实时跟上。无 DOM 的
 * 预渲染上下文里 `syncDocumentLocale` 自会静默返回。
 */
watch(locale, syncDocumentLocale, { immediate: true });

/**
 * 灰色 / 色弱滤镜（P2-10）写在 `<html>` 上。
 *
 * `filterStyle` 为 null 时清掉内联 `filter`（而不是写空串以外的值）。ubean 的 dev
 * 预渲染在 Node 里执行本组件且没有 `document`，所以能力检测先行 —— 与守卫里的
 * 判据一致（见 AGENTS.md「已知陷阱」）。
 */
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
