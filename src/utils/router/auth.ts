/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 根据用户权限过滤路由
 * @param routes - 权限路由
 * @param permission - 权限
 */
export function filterAuthRoutesByUserPermission(routes: AuthRoute.Route[], permission: Auth.RoleType) {
  const filters: AuthRoute.Route[] = [];

  routes.forEach(route => {
    filterAuthRouteByUserPermission(route, permission);
  });
  return filters;
}

/**
 * 根据用户权限过滤单个路由
 * @param route - 单个权限路由
 * @param permission - 权限
 */
function filterAuthRouteByUserPermission(route: AuthRoute.Route, permission: Auth.RoleType): AuthRoute.Route[] {
  return [];
}
