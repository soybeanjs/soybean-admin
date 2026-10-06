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
 * 应用 locale → Vean UI 组件文案 locale 的映射。
 *
 * Vean（`@vean/ui`）默认只预注册 `en` 与 `zh-CN`；本应用用 `zh-CN` / `en-US`，
 * 多出来的 `en-US` 需要降级到 `en`。
 */
export const VEAN_LOCALE_MAP: Record<string, string> = {
  'zh-CN': 'zh-CN',
  'en-US': 'en'
};

/** 支持的 locale 列表 */
export const APP_LOCALES = ['zh-CN', 'en-US'] as const;
export type AppLocale = (typeof APP_LOCALES)[number];
