/** locale → 文档属性（`<html lang>` / `dir`）的纯逻辑 + 客户端同步 详见 docs/v3-notes.md N-143。 */

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

/** 把当前 locale 同步到 `<html lang>` / `<html dir>`（客户端副作用）。 */
export function syncDocumentLocale(code: string): void {
  if (typeof document === 'undefined') return;

  const { lang, dir } = buildDocumentLocaleAttrs(code);

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
}
