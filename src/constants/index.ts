/** 版本号在此声明而不是 `import pkg from '../package.json'`： 详见 docs/v3-notes.md N-275。 */
export const APP_VERSION = '3.0.0-beta.0';

/** 应用标题（`app.ts` 的 head 与路由守卫的 `document.title` 共用） */
export const APP_TITLE = 'SoybeanAdmin';

/** 应用描述 */
export const APP_DESCRIPTION = 'A fresh and elegant admin template';

/** ubean 挂载点 id（需与 `defineApp({ rootId })` 一致） */
export const APP_ROOT_ID = 'app';

/** 注意：Vean（`@vean/aria/locale`）出厂只注册 `en` 与 `zh-CN`，且未知 key 详见 docs/v3-notes.md N-276。 */
export const APP_LOCALES = ['zh', 'en'] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

/** 默认 locale（需与 `ubean.config.ts` 的 `i18n.defaultLocale` 一致） */
export const DEFAULT_LOCALE: AppLocale = 'zh';

/** 语言下拉的单一来源：`APP_LOCALES` 加一项 + 此处补一行即可，不要在视图里写 `if (value === 'zh')` 这类硬编码分支 详见 docs/v3-notes.md N-277。 */
export const APP_LOCALE_LABELS: Record<AppLocale, string> = {
  zh: '简体中文',
  en: 'English'
};

export * from './db';
export * from './error-code';
export * from './layout';
export * from './theme';
