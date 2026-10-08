/**
 * 主题 / 布局的可选项常量（P2-10 ~ P2-15）。
 *
 * `label` 一律是 **i18n key**（不是文案字面量）：这些表要进主题抽屉，
 * 切语言时必须由 `t()` 解析。真正的文案只在 `src/locales/{zh,en}.json`。
 */

/** 页面切换动画模式（7 种，对齐 v2 `themePageAnimationModeRecord`） */
export const PAGE_ANIMATION_MODES = [
  { value: 'fade-slide', label: 'theme.pageAnimateMode.fadeSlide' },
  { value: 'fade', label: 'theme.pageAnimateMode.fade' },
  { value: 'fade-bottom', label: 'theme.pageAnimateMode.fadeBottom' },
  { value: 'fade-scale', label: 'theme.pageAnimateMode.fadeScale' },
  { value: 'zoom-fade', label: 'theme.pageAnimateMode.zoomFade' },
  { value: 'zoom-out', label: 'theme.pageAnimateMode.zoomOut' },
  { value: 'none', label: 'theme.pageAnimateMode.none' }
] as const;

export type PageAnimationMode = (typeof PAGE_ANIMATION_MODES)[number]['value'];

/** 页签风格（v2 chrome/button/slider → Vean PageTabsVariant chrome/card/slider） */
export const TAB_VARIANTS = [
  { value: 'chrome', label: 'theme.tabVariant.chrome' },
  { value: 'card', label: 'theme.tabVariant.card' },
  { value: 'slider', label: 'theme.tabVariant.slider' }
] as const;

export type TabVariant = (typeof TAB_VARIANTS)[number]['value'];

/** 滚动模式（主体滚动 = 整个 body 滚；内容滚动 = 内容区自己滚） */
export const SCROLL_MODES = [
  { value: 'wrapper', label: 'theme.scroll.wrapper' },
  { value: 'content', label: 'theme.scroll.content' }
] as const;

/**
 * 水印时间格式（7 种，对齐 v2 `watermarkTimeFormatOptions`）。
 *
 * `value` 直接就是 `@vueuse/core` `useDateFormat` 的 format 串（内部走 dayjs
 * token），所以 label 与 value 同字面量 —— 这是「格式串本身即展示」的场景，
 * 不进 i18n。
 */
export const WATERMARK_TIME_FORMATS = [
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY/MM/DD HH:mm',
  'YYYY/MM/DD HH:mm:ss',
  'HH:mm',
  'HH:mm:ss',
  'MM-DD HH:mm'
] as const;

export type WatermarkTimeFormat = (typeof WATERMARK_TIME_FORMATS)[number];

/** 重置缓存策略（P2-20 矩阵的一个配置维度） */
export const RESET_CACHE_STRATEGIES = [
  { value: 'close', label: 'theme.resetCache.close' },
  { value: 'refresh', label: 'theme.resetCache.refresh' }
] as const;

export type ResetCacheStrategy = (typeof RESET_CACHE_STRATEGIES)[number]['value'];

/** 滤镜（视觉障碍模拟）：CSS filter 值 + 开关字段名 */
export const GRAYSCALE_FILTER = 'grayscale(100%)';

/** 色弱滤镜（反色 80%，对齐 v2 `colourWeakness`） */
export const COLOR_WEAKNESS_FILTER = 'invert(80%)';

/** 暗色模式的 `<html>` class（须与 `SConfigProvider` 的 `darkSelector: 'class'` 一致） */
export const DARK_CLASS = 'dark';
