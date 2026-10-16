import { registerLocale } from '@vean/aria/locale';
import type { LocaleRegistry } from '@vean/aria/locale';
import zhCN from '@vean/aria/locale/zh-CN';
import { APP_LOCALES } from '@/constants';
import type { AppLocale } from '@/constants';

/** 把应用 locale key（`zh` / `en`）对齐到 Vean 组件内置文案 key。详见 docs/v3-notes.md N-184。 */

/** Vean 出厂的 **13 个语言包**（`node_modules/@vean/aria/dist/locale/langs/`） 详见 docs/v3-notes.md N-185。 */
export const VEAN_LOCALE_PACKS = [
  'ar',
  'de',
  'en',
  'es',
  'fr',
  'id',
  'ja',
  'ko',
  'pt-BR',
  'ru',
  'tr',
  'zh-CN',
  'zh-TW'
] as const;

export type VeanLocalePack = (typeof VEAN_LOCALE_PACKS)[number];

/**
 * 应用 locale → Vean 语言包。
 * 裸码（`zh`）与语言包码（`zh-CN`）不一致时**必须**在此声明，否则按同名包精确匹配会找不到 `zh-CN`。
 */
export const APP_LOCALE_PACK_MAP = [
  { app: 'zh', pack: 'zh-CN' },
  { app: 'en', pack: 'en' }
] as const satisfies readonly { readonly app: AppLocale; readonly pack: VeanLocalePack }[];

/** 语言包加载器：**全部走 `() => import(...)`**，Vite 才能把它切成独立 chunk。 */
const VEAN_LOCALE_PACK_LOADERS: Record<VeanLocalePack, () => Promise<LocaleRegistry>> = {
  ar: () => import('@vean/aria/locale/ar').then(mod => mod.default),
  de: () => import('@vean/aria/locale/de').then(mod => mod.default),
  en: () => import('@vean/aria/locale/en').then(mod => mod.default),
  es: () => import('@vean/aria/locale/es').then(mod => mod.default),
  fr: () => import('@vean/aria/locale/fr').then(mod => mod.default),
  id: () => import('@vean/aria/locale/id').then(mod => mod.default),
  ja: () => import('@vean/aria/locale/ja').then(mod => mod.default),
  ko: () => import('@vean/aria/locale/ko').then(mod => mod.default),
  'pt-BR': () => import('@vean/aria/locale/pt-BR').then(mod => mod.default),
  ru: () => import('@vean/aria/locale/ru').then(mod => mod.default),
  tr: () => import('@vean/aria/locale/tr').then(mod => mod.default),
  'zh-CN': () => import('@vean/aria/locale/zh-CN').then(mod => mod.default),
  'zh-TW': () => import('@vean/aria/locale/zh-TW').then(mod => mod.default)
};

/** 应用裸码 `zh` 使用的语言包（唯一需要**同步**补注册的包） */
const ZH_APP_LOCALE: AppLocale = 'zh';

/** 运行时判定字符串是否是 13 个出厂包之一（受信边界，不收 `as` 断言） */
export function isVeanLocalePack(value: string): value is VeanLocalePack {
  return VEAN_LOCALE_PACKS.some(code => code === value);
}

/**
 * 运行时判定字符串是否是一个应用 locale。
 * 菜单 `@select` 把 item 的 `value` 交回来时类型只会收窄到 `string`，这是把 `string` 收回 `AppLocale` 的唯一入口（不收 `as` 断言）。
 */
export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.some(code => code === value);
}

/** 应用 locale → 语言包（纯函数，无副作用） 详见 docs/v3-notes.md N-188。 */
export function resolveVeanLocalePack(appLocale: string): VeanLocalePack | null {
  const mapped = APP_LOCALE_PACK_MAP.find(entry => entry.app === appLocale);

  if (mapped) return mapped.pack;

  return isVeanLocalePack(appLocale) ? appLocale : null;
}

/** 同步补注册出厂语言包（须在 `SConfigProvider` 解析 locale **之前**执行，见 `src/app.ts` 的调用点）。 */
export function registerVeanLocales(): void {
  registerLocale({ ...zhCN, key: ZH_APP_LOCALE });
}

/** 按需注册任意一个出厂语言包（13 个包全支持），把包消息挂到 `appLocale` 键上。 */
export async function registerVeanLocalePack(appLocale: string): Promise<boolean> {
  const pack = resolveVeanLocalePack(appLocale);

  if (!pack) return false;

  const messages = await VEAN_LOCALE_PACK_LOADERS[pack]();

  registerLocale({ ...messages, key: appLocale });

  return true;
}
