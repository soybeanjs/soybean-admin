/**
 * `virtual:ubean-pages` 的环境声明。
 *
 * 这个虚拟模块由 `ubean/vite` 的插件在构建期生成（`createVuePagesVirtualModule`），
 * 内容是 `src/pages` 的扫描结果。ubean 目前不落盘它的 `.d.ts`（只有精简内核的
 * `virtual:ubean-vue-routes` 会写到 `.ubean/ubean-vue-routes.d.ts`，而本项目走的是
 * 完整框架插件、不生成那份），所以这里手写一份。
 *
 * 条目形状见 `@/typings/ubean-page`（独立模块，不写在 `.d.ts` 里 —— 否则
 * `declare module` 会退化成「增强一个不存在的模块」并报 TS2306）。
 *
 * `pages` 是菜单的唯一数据源：目录页与外链页是 `routable: false` 的元数据页，
 * 它们**不在** `routes` / `router.getRoutes()` 里，只有这里能看到。
 */
declare module 'virtual:ubean-pages' {
  import type { Component } from 'vue';
  import type { RouteRecordRaw } from 'vue-router';
  import type { UbeanScannedPage } from '@/typings/ubean-page';

  export type { UbeanScannedPage };

  export const routes: RouteRecordRaw[];
  export const pageNames: string[];
  export const layoutNames: string[];
  export const defaultLayout: string | null;
  export const pages: Record<string, UbeanScannedPage>;
  export const loadingComponent: Component | null;
  export const errorComponent: Component | null;
  export function resolvePageComponent(name: string): Promise<Component>;
  export function resolveLayoutComponent(name: string): Promise<Component | null>;
  export function resolveLoadingComponent(): Promise<Component | null>;
  export function resolveErrorComponent(): Promise<Component | null>;
  export function hasNotFoundPage(): boolean;
  export function hasErrorPage(): boolean;
}
