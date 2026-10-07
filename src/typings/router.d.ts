/**
 * vue-router `RouteMeta` 全局扩展：让 `route.meta` / `to.meta` 在全仓内
 * 直接以 `AppRouteMeta` 形状访问（字段全可选，不破坏 ubean 文件路由的
 * `definePage({ meta })`），从源头消灭各调用点的 `as AppRouteMeta` 断言。
 *
 * 注意：module augmentation 必须放在「模块文件」里（有顶层 import/export），
 * 放在全局脚本 `.d.ts` 里会被当作 ambient module declaration 而不生效。
 */
import type { AppRouteMeta } from './app';

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}
