import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RTL_LANGUAGE_SUBTAGS,
  buildDocumentLocaleAttrs,
  resolveLocaleDir,
  resolveLocaleSubtag,
  syncDocumentLocale
} from '@/shared/i18n';

/** `<html lang>` / `<html dir>` 派生的纯函数守卫 详见 docs/v3-notes.md N-430。 */
describe('locale 子标签与书写方向', () => {
  it('裁掉地区/书写体后缀，大小写不敏感', () => {
    expect(resolveLocaleSubtag('zh')).toBe('zh');
    expect(resolveLocaleSubtag('zh-CN')).toBe('zh');
    expect(resolveLocaleSubtag('ZH-hant-TW')).toBe('zh');
    expect(resolveLocaleSubtag('')).toBe('');
  });

  it('RTL 语言（含带地区后缀）判为 rtl，其余 ltr', () => {
    for (const subtag of RTL_LANGUAGE_SUBTAGS) {
      expect(resolveLocaleDir(subtag), subtag).toBe('rtl');
      expect(resolveLocaleDir(`${subtag}-XX`), subtag).toBe('rtl');
    }

    expect(resolveLocaleDir('zh')).toBe('ltr');
    expect(resolveLocaleDir('en-US')).toBe('ltr');
    expect(resolveLocaleDir('zh-Hant')).toBe('ltr');
  });

  it('attrs 与 dir 判定同源', () => {
    expect(buildDocumentLocaleAttrs('zh')).toEqual({ lang: 'zh', dir: 'ltr' });
    expect(buildDocumentLocaleAttrs('ar-EG')).toEqual({ lang: 'ar-EG', dir: 'rtl' });
  });

  it('无 DOM 上下文（预渲染）静默返回，不抛错', () => {
    expect(typeof document).toBe('undefined');
    expect(() => syncDocumentLocale('ar')).not.toThrow();
  });

  it('有 DOM 时写入 documentElement 的 lang / dir', () => {
    vi.stubGlobal('document', { documentElement: { lang: '', dir: '' } });

    syncDocumentLocale('ar-EG');
    expect(document.documentElement.lang).toBe('ar-EG');
    expect(document.documentElement.dir).toBe('rtl');

    syncDocumentLocale('zh');
    expect(document.documentElement.lang).toBe('zh');
    expect(document.documentElement.dir).toBe('ltr');
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
