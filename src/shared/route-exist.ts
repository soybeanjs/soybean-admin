/**
 * NotFound 落点判定：404 vs 403（P3-07，v3 §4.2「路径存在但无权限 → 403」）。
 *
 * 两种权限模式的区别决定了这个判定只能有一半靠本地：
 * - **static**：全部路由在本地路由表里一次性注册，能导航到的都在表里；
 *   落到 `NotFound` 就是真 404，与权限无关 → 不查、不判。
 * - **dynamic**：路由由 `GET /api/menu/user` 按权限下发。菜单里存在、但当前
 *   用户无权 → 路由没被注册 → 落到 `NotFound`。此时必须反查一次后端
 *   （`POST /api/menu/exist-path`）：路径**存在** → 403（无权限），
 *   不存在 → 真的 404。
 *
 * 抽成纯函数是为了能单测（守卫本身依赖 pinia / localStorage 跑不起来）。
 */
export type AuthRouteMode = 'static' | 'dynamic';

export function shouldTreatMissingRouteAsForbidden(input: {
  authRouteMode: AuthRouteMode;
  /** 菜单是否已初始化 —— 未初始化时 NotFound 可能只是路由还没注册 */
  menuInited: boolean;
  /** 后端反查结果：该路径在菜单表里存在 */
  routeExists: boolean;
}): boolean {
  if (input.authRouteMode !== 'dynamic') return false;
  if (!input.menuInited) return false;

  return input.routeExists;
}
