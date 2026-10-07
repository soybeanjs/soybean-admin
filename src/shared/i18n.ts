/**
 * locale → 文档属性（`<html lang>` / `dir`）的纯逻辑 + 客户端同步。
 *
 * **为什么需要**：`src/app.ts` 的 `defineApp({ head: { htmlAttrs: { lang } } })`
 * 是**构建期静态值**（写死 `DEFAULT_LOCALE`），页面里的语言切换不会改它。
 * 组件文案、标题都会跟着 i18n 走，只有 `<html lang>` 会一直停在初始语言 ——
 * 对屏幕阅读器（朗读语言）、浏览器翻译提示、CSS `:lang()` 都是错的。
 *
 * `dir` 同理：`zh` / `en` 都是 `ltr`，但本文件按**全局**规则解析，13 个 Vean
 * 语言包里的 `ar` / `ru` 等（RTL 集合）切过去时自动变 `rtl`。
 * 与 `@vean/aria/locale` 的 `resolveLocaleDirection()` 同一份 RTL 集合
 * （`ar/he/fa/ur/yi/ps/sd/ug/ku/dv`，按主语言码匹配）。
 */

/** RTL 语言的主语言码（小写）集合 —— 与 Vean 内部集合保持一致 */
export const RTL_LANGUAGE_SUBTAGS = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ug', 'ku', 'dv'] as const;

/** `zh-CN` → `zh`；`pt-BR` → `pt`；大小写不敏感 */
export function resolveLocaleSubtag(code: string): string {
  return code.split('-')[0].toLowerCase();
}

/** locale → 文字方向（未知语言一律 `ltr`） */
export function resolveLocaleDir(code: string): 'ltr' | 'rtl' {
  const subtag = resolveLocaleSubtag(code);

  return RTL_LANGUAGE_SUBTAGS.some(rtl => rtl === subtag) ? 'rtl' : 'ltr';
}

/** locale → `<html>` 上要写的属性集合（纯函数，便于单测） */
export function buildDocumentLocaleAttrs(code: string): { lang: string; dir: 'ltr' | 'rtl' } {
  return { lang: code, dir: resolveLocaleDir(code) };
}

/**
 * 把当前 locale 同步到 `<html lang>` / `<html dir>`（客户端副作用）。
 *
 * 无 `document` 时静默返回 —— ubean dev 的 HTML 请求会在 Node 里预渲染执行
 * 应用（`src/app.vue` 的 watcher 也会跑），那里没有 DOM（同 `src/router/guard.ts`
 * 的教训：判据是能力检测，不是 `import.meta.server`）。
 */
export function syncDocumentLocale(code: string): void {
  if (typeof document === 'undefined') return;

  const { lang, dir } = buildDocumentLocaleAttrs(code);

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
}
