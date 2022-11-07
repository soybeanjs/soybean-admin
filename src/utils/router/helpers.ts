/**
 * 获取所有固定路由的名称集合
 * @param routes - 固定路由
 */
export function getConstantRouteNames(routes: AuthRoute.Route[]) {
  return routes.map(route => getConstantRouteName(route)).flat(1);
}

/**
 * 将权限路由转换成搜索的菜单数据
 * @param routes - 权限路由
 * @param treeMap
 */
export function transformAuthRouteToSearchMenus(routes: AuthRoute.Route[], treeMap: AuthRoute.Route[] = []) {
  if (routes && routes.length === 0) return [];
  return routes.reduce((acc, cur) => {
    if (!cur.meta?.hide) {
      acc.push(cur);
    }
    if (cur.children && cur.children.length > 0) {
      transformAuthRouteToSearchMenus(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
}

/** 将路由名字转换成路由路径 */
export function transformRouteNameToRoutePath(name: Exclude<AuthRoute.AllRouteKey, 'not-found'>): AuthRoute.RoutePath {
  const rootPath: AuthRoute.RoutePath = '/';
  if (name === 'root') return rootPath;

  const splitMark = '_';
  const pathSplitMark = '/';
  const path = name.split(splitMark).join(pathSplitMark);

  return (pathSplitMark + path) as AuthRoute.RoutePath;
}

/** 将路由路径转换成路由名字 */
export function transformRoutePathToRouteName<K extends AuthRoute.RoutePath>(path: K) {
  if (path === '/') return 'root';

  const pathSplitMark = '/';
  const routeSplitMark = '_';

  const name = path.split(pathSplitMark).slice(1).join(routeSplitMark) as AuthRoute.AllRouteKey;

  return name;
}

/**
 * 获取所有固定路由的名称集合
 * @param route - 固定路由
 */
function getConstantRouteName(route: AuthRoute.Route) {
  const names = [route.name];
  if (hasChildren(route)) {
    names.push(...route.children!.map(item => getConstantRouteName(item)).flat(1));
  }
  return names;
}

/**
 * 是否有子路由
 * @param item - 权限路由
 */
function hasChildren(item: AuthRoute.Route) {
  return Boolean(item.children && item.children.length);
}
