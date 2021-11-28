import type { RouteRecordRaw } from 'vue-router';
import type { GlobalMenuOption } from '@/interface';
import { iconifyRender } from '../common';

/** 判断路由是否作为菜单 */
function asMenu(route: RouteRecordRaw) {
  return !route.meta?.notAsMenu;
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

/** 将路由转换成菜单 */
export function transformRouteToMenu(routes: RouteRecordRaw[]) {
  const globalMenu: GlobalMenuOption[] = [];
  routes.forEach(route => {
    const { name, path, meta } = route;
    const routeName = name as string;
    let menuChildren: GlobalMenuOption[] | undefined;
    if (route.children) {
      menuChildren = transformRouteToMenu(route.children as RouteRecordRaw[]);
    }
    const menuItem: GlobalMenuOption = addPartialProps(
      {
        key: routeName,
        label: meta?.title ?? routeName,
        routeName,
        routePath: path
      },
      meta?.icon,
      menuChildren
    );
    if (asMenu(route)) {
      globalMenu.push(menuItem);
    } else if (menuChildren) {
      globalMenu.push(...menuChildren);
    }
  });
  return globalMenu;
}
