import type { RouteRecordRaw } from 'vue-router';
import { consoleError } from '../common';
import { getLayoutComponent, getViewComponent } from './component';

type ComponentAction = Record<AuthRoute.RouteComponent, () => void>;

/**
 * 将权限路由转换成vue路由
 * @param routes - 权限路由
 * @description 所有多级路由都会被转换成二级路由
 */
export function transformAuthRoutesToVueRoutes(routes: AuthRoute.Route[]) {
  return routes.map(route => transformAuthRouteToVueRoute(route)).flat(1);
}

/** 将路由转换成菜单列表 */
export function transformRouteToList(routes: AuthRoute.Route[], treeMap: AuthRoute.Route[] = []) {
  if (routes && routes.length === 0) return [];
  return routes.reduce((acc, cur) => {
    if (!cur.meta?.hide) {
      acc.push(cur);
    }
    if (cur.children && cur.children.length > 0) {
      transformRouteToList(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
}

/**
 * 将单个权限路由转换成vue路由
 * @param route - 权限路由
 */
function transformAuthRouteToVueRoute(item: AuthRoute.Route) {
  const resultRoute: RouteRecordRaw[] = [];

  const itemRoute = { ...item } as RouteRecordRaw;

  // 动态path
  if (hasDynamicPath(item)) {
    Object.assign(itemRoute, { path: item.meta.dynamicPath });
  }

  // 外链路由
  if (hasHref(item)) {
    Object.assign(itemRoute, { component: getViewComponent('not-found-page') });
  }

  // 路由组件
  if (hasComponent(item)) {
    const action: ComponentAction = {
      basic() {
        itemRoute.component = getLayoutComponent('basic');
      },
      blank() {
        itemRoute.component = getLayoutComponent('blank');
      },
      multi() {
        // 多级路由一定有子路由
        if (hasChildren(item)) {
          Object.assign(itemRoute, { meta: { ...itemRoute.meta, multi: true } });
          delete itemRoute.component;
        } else {
          consoleError('多级路由缺少子路由: ', item);
        }
      },
      self() {
        itemRoute.component = getViewComponent(item.name);
      }
    };
    try {
      action[item.component!]();
    } catch {
      consoleError('路由组件解析失败: ', item);
    }
  }

  // 注意：单独路由没有children
  if (isSingleRoute(item)) {
    if (hasChildren(item)) {
      consoleError('单独路由不应该有子路由: ', item);
    }

    // 捕获无效路由的需特殊处理
    if (item.name === 'not-found-page') {
      itemRoute.children = [
        {
          path: '',
          name: item.name,
          component: getViewComponent('not-found-page')
        }
      ];
    } else {
      const parentPath = `${itemRoute.path}-parent` as AuthRoute.SingleRouteParentPath;

      const layout = item.meta.singleLayout === 'basic' ? getLayoutComponent('basic') : getLayoutComponent('blank');

      const parentRoute: RouteRecordRaw = {
        path: parentPath,
        component: layout,
        redirect: item.path,
        children: [itemRoute]
      };

      return [parentRoute];
    }
  }

  // 子路由
  if (hasChildren(item)) {
    const children = item.children!.map(child => transformAuthRouteToVueRoute(child)).flat();

    // 找出第一个不为多级路由中间级的子路由路径作为重定向路径
    const redirectPath: AuthRoute.RoutePath = (children.find(item => !item.meta?.multi)?.path ||
      '/') as AuthRoute.RoutePath;
    if (redirectPath === '/') {
      consoleError('该多级路由没有有效的子路径', item);
    }

    if (item.component === 'multi') {
      // 多级路由，将子路由提取出来变成同级
      resultRoute.push(...children);
      delete itemRoute.children;
    } else {
      itemRoute.children = children;
    }
    itemRoute.redirect = redirectPath;
  }

  resultRoute.push(itemRoute);

  return resultRoute;
}

/**
 * 是否有外链
 * @param item - 权限路由
 */
function hasHref(item: AuthRoute.Route) {
  return Boolean(item.meta.href);
}

/**
 * 是否有动态路由path
 * @param item - 权限路由
 */
function hasDynamicPath(item: AuthRoute.Route) {
  return Boolean(item.meta.dynamicPath);
}

/**
 * 是否有路由组件
 * @param item - 权限路由
 */
function hasComponent(item: AuthRoute.Route) {
  return Boolean(item.component);
}

/**
 * 是否有子路由
 * @param item - 权限路由
 */
function hasChildren(item: AuthRoute.Route) {
  return Boolean(item.children && item.children.length);
}

/**
 * 是否是单层级路由
 * @param item - 权限路由
 */
function isSingleRoute(item: AuthRoute.Route) {
  return Boolean(item.meta.singleLayout);
}
