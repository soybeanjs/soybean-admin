import { registerLocale } from '@vean/aria/locale';
import zhCN from '@vean/aria/locale/zh-CN';

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
 * `en` 无需处理：出厂的 `en` 就是我们要的 key，且 `en` 恰好也是 ubean 对
 * `locales/default.*` 的特例约定（`scanLocales()` 里 `isDefault && code ===
 * 'default'` → `'en'`）。
 *
 * 放在 `@/shared/` 而非 `@/locales/`：ubean 的 locale 扫描 glob 覆盖
 * `.ts`（`**\/*.{json,json5,yaml,yml,js,mjs,cjs,ts,mts,cts}`），把本文件放进
 * `src/locales/` 会被当成一个名叫 `vean` 的 locale 收录进 `.ubean/i18n.d.ts`。
 */
export function registerVeanLocales(): void {
  registerLocale({ ...zhCN, key: 'zh' });
}
