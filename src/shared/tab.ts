import type { AppRouteMeta } from '@/typings/app';

/**
 * 「这条路由该不该出现在页签栏」的单一判定（P4-03）。
 *
 * ## 为什么单独抽一个模块
 *
 * 页签栏是后台壳（`default` 布局）的一部分，而 `blank` 布局的页面
 * （登录 / 403 / 404 / 500）压根不渲染这个壳 —— 把它们的路由加进页签，会出现
 * 「点了跳到空白页」的假页签：登录成功后页签栏里赫然挂着一个「登录」，且点它
 * 会被守卫弹回首页。实测症状就是登录后页签栏 `登录 | 工作台`。
 *
 * 判定**只看布局**，不看 `requiresAuth`：登录页与 500 页都是公开页，但它们
 * 已经被布局这一条排除；反过来，将来若有需要登录却不该进页签的页面，布局
 * 仍是它自己的语义声明，不需要再加一条白名单。
 *
 * 这是**跨层契约**：静态页的 `layout` 来自 `definePage({ layout })`（ubean
 * 写进 `meta.layout`），dynamic 路由的来自菜单行的 `routeLayout`
 * （`transformMenuToRoute` 写进 `meta.layout`）。两份都不写时**是 `default`**，
 * 所以判定写成「显式声明为 blank 才排除」，而不是「等于 default 才收」——
 * 后者会把 `undefined` 一起排除掉。
 *
 * `scripts/menu-sync.ts` 的 `isMenuPage()` 用同样的 `page.layout === 'blank'`
 * 判定把这类页面挡在菜单外，两处语义一致（那边读的是扫描器的 `page.layout`，
 * 这边读的是路由 meta，来源同一条定义）。
 */

/** 不渲染后台壳、因而也不该进页签栏的布局名 */
export const BLANK_LAYOUT = 'blank';

/** 路由该不该进页签栏（`meta.layout === 'blank'` 的页面一律不进） */
export function isTabbableRoute(meta: AppRouteMeta): boolean {
  return meta.layout !== BLANK_LAYOUT;
}
