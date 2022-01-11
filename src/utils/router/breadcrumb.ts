import type { GlobalMenuOption, GlobalBreadcrumb } from '@/interface';

/**
 * 获取面包屑数据
 * @param activeKey - 当前页面路由的key
 * @param menus - 菜单数据
 * @param rootPath - 根路由路径
 */
export function getBreadcrumbByRouteKey(activeKey: string, menus: GlobalMenuOption[], rootPath: string) {
  return menus.map(menu => getBreadcrumbItem(activeKey, menu, rootPath)).flat(1);
}

function getBreadcrumbItem(activeKey: string, menu: GlobalMenuOption, rootPath: string) {
  const list: GlobalBreadcrumb[] = [];
  if (activeKey.includes(menu.routeName)) {
    const breadcrumb: GlobalBreadcrumb = {
      key: menu.routeName,
      label: menu.label as string,
      routeName: menu.routeName,
      disabled: menu.routePath === rootPath,
      hasChildren: false
    };
    if (menu.icon) {
      breadcrumb.icon = menu.icon;
    }
    if (menu.children && menu.children.length) {
      breadcrumb.hasChildren = true;
      breadcrumb.children = menu.children
        .map(item => getBreadcrumbItem(activeKey, item as GlobalMenuOption, rootPath))
        .flat(1);
    }
    list.push(breadcrumb);
  }
  return list;
}
