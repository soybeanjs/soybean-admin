/**
 * 应用常量。
 *
 * 版本号在此声明而不是 `import pkg from '../package.json'`：
 * JSON import 会把整个 package.json 打进产物，且 SSR/客户端两份模块图各持一份。
 */
export const APP_VERSION = '3.0.0-beta.0';

/** 应用标题（`app.ts` 的 head 与路由守卫的 `document.title` 共用） */
export const APP_TITLE = 'SoybeanAdmin';

/** 应用描述 */
export const APP_DESCRIPTION = 'A fresh and elegant admin template';

/** ubean 挂载点 id（需与 `defineApp({ rootId })` 一致） */
export const APP_ROOT_ID = 'app';

/**
 * 应用 locale 列表。
 *
 * 刻意用裸语言码 `zh` / `en` 而不是 `zh-CN` / `en-US`：ubean 把 locale code
 * 直接当作 URL 前缀（`strategy: 'prefix_except_default'`），裸码让路径更简洁
 * （`/en/...` vs `/en-US/...`）。
 *
 * 注意：Vean（`@vean/aria/locale`）出厂只注册 `en` 与 `zh-CN`，且未知 key
 * **静默回落到 `en`**。所以 `zh` 必须用 `registerVeanLocales()` 补注册（见
 * `@/shared/vean-locale`，在 `src/app.ts` 调用），否则组件内置文案会变英文。
 */
export const APP_LOCALES = ['zh', 'en'] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

/** 默认 locale（需与 `ubean.config.ts` 的 `i18n.defaultLocale` 一致） */
export const DEFAULT_LOCALE: AppLocale = 'zh';

export * from './db';
export * from './error-code';
