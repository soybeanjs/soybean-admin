/**
 * `virtual:ubean-pages` 在单测里的替身（在 `vitest.config.ts` 里别名到这里）。
 *
 * 这个虚拟模块由 `ubean/vite` 的插件在构建期生成，vitest 走自己的转换管线、不加载
 * `vite.config.ts`，少了这个别名任何 import `@/store/modules/menu` 的单测都会抛
 * `Cannot find package 'virtual:ubean-pages'`。
 *
 * 空清单是刻意的：单测要验的是**派生规则**，用 `derive.ts` 的显式入参 + 夹具页面
 * 更好读也更稳，不该依赖当前仓库恰好有哪些页面（那样加一个页面就红一批测试）。
 */
import type { UbeanScannedPage } from '@/typings/ubean-page';

export const pages: Record<string, UbeanScannedPage> = {};
export const pageNames: string[] = [];
export const routes: unknown[] = [];
