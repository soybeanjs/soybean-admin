import type { PageMeta } from '@ubean/vue';

/**
 * 扫描结果的一个页面条目。
 *
 * 独立成一个普通模块（而不是写在 `virtual-pages.d.ts` 里）是必须的：`.d.ts` 里一旦有
 * 顶层 `import`/`export`，`declare module 'virtual:ubean-pages'` 就从「声明一个环境模块」
 * 变成「增强一个不存在的模块」，`pnpm typecheck` 直接报 TS2306。
 *
 * 与 `@ubean/vue/dist/vite.js` 的 `renderVirtualModuleBody()` 保持同形 —— 字段名或
 * 可选性变了要同步改这里，否则 `pnpm typecheck` 会过、运行时取到 `undefined`。
 */
export interface UbeanScannedPage {
  name: string;
  route: string;
  path: string;
  /** 布局名、多层嵌套数组或 `false`（禁用布局） */
  layout?: string | string[] | false;
  isReuse: boolean;
  /** `.meta.{ts,js}` 元数据页：有 meta、无组件 */
  isMeta: boolean;
  /** 是否参与路由注册；`false` 的条目只出现在扫描清单里 */
  routable: boolean;
  reuseTarget?: string;
  /** `definePage()` 的原始结果（菜单标题 / 图标 / 层级都从这里读） */
  pageMeta: PageMeta | null;
}
