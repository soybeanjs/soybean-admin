import type { AppRouteMeta } from '@/typings/app';

/** 「这条路由该不该出现在页签栏」的单一判定（P4-03） 详见 docs/v3-notes.md N-173。 */

/** 不渲染后台壳、因而也不该进页签栏的布局名 */
export const BLANK_LAYOUT = 'blank';

/** 路由该不该进页签栏（`meta.layout === 'blank'` 的页面一律不进） */
export function isTabbableRoute(meta: AppRouteMeta): boolean {
  return meta.layout !== BLANK_LAYOUT;
}
