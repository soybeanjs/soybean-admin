import type { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/layouts';
import { consoleError } from '../common';
import { getViewComponent } from './component';

type ComponentAction = {
  [key in AuthRoute.RouteComponent]: () => void;
};

/**
 * 将权限路由转换成vue路由
 * @param routes - 权限路由
 */
export function transformAuthRoutesToVueRoutes(routes: AuthRoute.Route[]) {
  return routes.map(route => transformAuthRouteToVueRoute(route)).flat(1);
}

/**
 * 将单个权限路由转换成vue路由
 * @param route - 权限路由
 */
function transformAuthRouteToVueRoute(item: AuthRoute.Route) {
  const resultRoute: RouteRecordRaw[] = [];

  const itemRoute = { ...item } as RouteRecordRaw;

  if (hasDynamicPath(item)) {
    Object.assign(itemRoute, { path: item.meta.dynamicPath });
  }

  if (hasComponent(item)) {
    const action: ComponentAction = {
      layout() {
        itemRoute.component = Layout;
      },
      blank() {
        itemRoute.component = Layout;
        if (itemRoute.meta) {
          itemRoute.meta.blankLayout = true;
        }
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

      if (item.meta.singleLayout === 'blank') {
        itemRoute.meta!.blankLayout = true;
      }

      const parentRoute: RouteRecordRaw = {
        path: parentPath,
        component: Layout,
        redirect: item.path,
        children: [itemRoute]
      };

      return [parentRoute];
    }
  }

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

function hasComponent(item: AuthRoute.Route) {
  return Boolean(item.component);
}

function hasChildren(item: AuthRoute.Route) {
  return Boolean(item.children && item.children.length);
}

function hasDynamicPath(item: AuthRoute.Route) {
  return Boolean(item.meta.dynamicPath);
}

function isSingleRoute(item: AuthRoute.Route) {
  return Boolean(item.meta.singleLayout);
}
