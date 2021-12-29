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

/** 将路由转换成菜单列表 */
export function transformRouteToList(routes: RouteRecordRaw[], treeMap: RouteRecordRaw[] = []) {
  if (routes && routes.length === 0) return [];
  return routes.reduce((acc, cur) => {
    if (!cur.meta?.notAsMenu) {
      acc.push(cur);
    }
    if (cur.children && cur.children.length > 0) {
      transformRouteToList(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
}

/** 判断路由是否为Url链接 */
export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}
