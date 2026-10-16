/** 两种权限模式的区别决定了这个判定只能有一半靠本地： 详见 docs/v3-notes.md N-167。 */
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
