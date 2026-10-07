import { registerLocale } from '@vean/aria/locale';
import type { LocaleRegistry } from '@vean/aria/locale';
import zhCN from '@vean/aria/locale/zh-CN';
import type { AppLocale } from '@/constants';

/**
 * 把应用 locale key（`zh` / `en`，见 `@/constants` 的 `APP_LOCALES`）对齐到
 * Vean 的组件内置文案。
 *
 * **为什么需要这一步**：`@vean/aria/locale` 出厂只注册两个 key —— `en`
 * 与 `zh-CN`（`node_modules/@vean/aria/dist/locale/locales.js` 里的
 * `{[en.key]: en, [zhCN.key]: zhCN}`），而 `resolveLocaleRegistry()` 对**未知
 * key 静默回落到 `en`**：
 *
 * ```
 * resolveLocaleRegistry('zh').key        // 'en'（回落！）
 * resolveLocale('zh').table.emptyTitle   // 'No data'（应为「暂无数据」）
 * ```
 *
 * 也就是说，仅把 locale 目录改成 `zh.json` 会让分页、表格空态、标签页等
 * **Vean 组件内部文案全部变英文**，且不报任何错。这里把 `zh-CN` 的消息以
 * `zh` 为 key 再注册一份补上。
 *
 * 放在 `@/shared/` 而非 `@/locales/`：ubean 的 locale 扫描 glob 覆盖
 * `.ts`（`**\/*.{json,json5,yaml,yml,js,mjs,cjs,ts,mts,cts}`），把本文件放进
 * `src/locales/` 会被当成一个名叫 `vean` 的 locale 收录进 `.ubean/i18n.d.ts`。
 */

/**
 * Vean 出厂的 **13 个语言包**（`node_modules/@vean/aria/dist/locale/langs/`）。
 *
 * 与 `@/constants` 的 `APP_LOCALES` 是两件事：`APP_LOCALES` 是**本应用**
 * 提供 JSON 文案的语言（当前 `zh` / `en`），这里是**组件库**自带的文案包。
 * 但两者必须键连起来（见 `APP_LOCALE_PACK_MAP`），否则组件文案会静默变英文。
 */
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
 *
 * 裸码（`zh`）与语言包码（`zh-CN`）不一致时**必须**在此声明，否则
 * `resolveVeanLocalePack()` 会退化成「按同名包精确匹配」而找不到 `zh-CN`。
 */
export const APP_LOCALE_PACK_MAP = [
  { app: 'zh', pack: 'zh-CN' },
  { app: 'en', pack: 'en' }
] as const satisfies readonly { readonly app: AppLocale; readonly pack: VeanLocalePack }[];

/**
 * 语言包加载器：**全部走 `() => import(...)`**，Vite 才能把它切成独立 chunk。
 * 只有被 `registerVeanLocalePack()` 真正请求到的包才会进入客户端产物 ——
 * 13 个包合计 ~45 kB，静态 import 会白送进首屏。
 */
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
 * 应用 locale → 语言包（纯函数，无副作用）。
 *
 * 解析顺序：① 显式映射表（`zh` → `zh-CN`）→ ② 与包同名的精确匹配
 * （`ja` / `ko` / `pt-BR` / `zh-TW` …）→ ③ `null`（未知语言，调用方决定回落）。
 */
export function resolveVeanLocalePack(appLocale: string): VeanLocalePack | null {
  const mapped = APP_LOCALE_PACK_MAP.find(entry => entry.app === appLocale);

  if (mapped) return mapped.pack;

  return isVeanLocalePack(appLocale) ? appLocale : null;
}

/**
 * 同步补注册出厂语言包（须在 `SConfigProvider` 解析 locale **之前**执行，
 * 见 `src/app.ts` 的调用点）。
 *
 * 只处理 `zh-CN` 一个包：出厂已注册的 `en` 恰好就是应用侧裸码 `en`，无需再注册；
 * 其余 11 个包不在本应用 `APP_LOCALES` 里，走 `registerVeanLocalePack()` 按需加载。
 */
export function registerVeanLocales(): void {
  registerLocale({ ...zhCN, key: ZH_APP_LOCALE });
}

/**
 * 按需注册任意一个出厂语言包（13 个包全支持），把包消息挂到 `appLocale` 键上。
 *
 * 用于「应用新增了非 `zh` / `en` 的语言」场景：客户端 setup 阶段无法同步
 * `import()`，所以语言切换时要先 `await registerVeanLocalePack(code)` 再切
 * vue-i18n 的 locale，否则组件文案会在包加载完成前回落到 `en`。
 *
 * @returns 是否注册成功（`false` = 该语言没有对应的 Vean 出厂包）
 */
export async function registerVeanLocalePack(appLocale: string): Promise<boolean> {
  const pack = resolveVeanLocalePack(appLocale);

  if (!pack) return false;

  const messages = await VEAN_LOCALE_PACK_LOADERS[pack]();

  registerLocale({ ...messages, key: appLocale });

  return true;
}
