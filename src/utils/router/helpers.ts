/**
 * 获取所有固定路由的名称集合
 * @param routes - 固定路由
 */
export function getConstantRouteNames(routes: AuthRoute.Route[]) {
  return routes.map(route => getConstantRouteName(route)).flat(1);
}

/**
 * 获取所有固定路由的名称集合
 * @param route - 固定路由
 */
function getConstantRouteName(route: AuthRoute.Route) {
  const names = [route.name];
  if (route.children?.length) {
    names.push(...route.children!.map(item => getConstantRouteName(item)).flat(1));
  }
  return names;
}

/**
 * 根据路由名称查找顶级菜单
 * @param routeName - 当前页面路由的key
 * @param menus - 菜单数据
 */
export function getTopLevelMenu(routeName: string, menus: App.GlobalMenuOption[]): App.GlobalMenuOption | undefined {
  return menus.find(item => {
    if (item.routeName === routeName) return true;
    if (Array.isArray(item.children)) {
      return getTopLevelMenu(routeName, item.children);
    }
    return false;
  });
}
