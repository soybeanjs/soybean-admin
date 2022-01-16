import type { GlobalMenuOption } from '@/interface';
import { iconifyRender } from '../common';

/** 路由不转换菜单 */
function hideInMenu(route: AuthRoute.Route) {
  return Boolean(route.meta.hide);
}

/** 给菜单添加可选属性 */
function addPartialProps(menuItem: GlobalMenuOption, icon?: string, children?: GlobalMenuOption[]) {
  const item = { ...menuItem };
  if (icon) {
    Object.assign(item, { icon: iconifyRender(icon) });
  }
  if (children) {
    Object.assign(item, { children });
  }
  return item;
}

/**
 * 将权限路由转换成菜单
 * @param routes - 路由
 */
export function transformAuthRouteToMenu(routes: AuthRoute.Route[]): GlobalMenuOption[] {
  const globalMenu: GlobalMenuOption[] = [];
  routes.forEach(route => {
    const { name, path, meta } = route;
    const routeName = name as string;
    let menuChildren: GlobalMenuOption[] | undefined;
    if (route.children) {
      menuChildren = transformAuthRouteToMenu(route.children);
    }
    const menuItem: GlobalMenuOption = addPartialProps(
      {
        key: routeName,
        label: meta.title,
        routeName,
        routePath: path
      },
      meta?.icon,
      menuChildren
    );

    if (!hideInMenu(route)) {
      globalMenu.push(menuItem);
    }
  });

  return globalMenu;
}
