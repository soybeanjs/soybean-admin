import type { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/layouts';
import { consoleError } from '../common';
import { getViewComponent } from './component';

type ComponentAction = {
  [key in AuthRoute.RouteComponent]: () => void;
};

/** 将权限路由类型转换成vue路由类型 */
export function transformAuthRouteToVueRoute(item: AuthRoute.Route) {
  const { name, path } = item;
  const itemRoute: Partial<RouteRecordRaw> = {
    name,
    path,
    meta: item.meta
  };
  if (hasRedirect(item)) {
    itemRoute.redirect = item.redirect;
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
      multi() {},
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
  if (isSingleRoute(item)) {
    itemRoute.children = [
      {
        path: '',
        name: item.name,
        component: getViewComponent(item.name)
      }
    ];
  } else if (hasChildren(item)) {
    itemRoute.children = item.children!.map(child => transformAuthRouteToVueRoute(child));
  }

  return itemRoute as RouteRecordRaw;
}

function hasComponent(item: AuthRoute.Route) {
  return Boolean(item.component);
}

function hasRedirect(item: AuthRoute.Route) {
  return Boolean(item.redirect);
}

function hasChildren(item: AuthRoute.Route) {
  return Boolean(item.children && item.children.length);
}

function isSingleRoute(item: AuthRoute.Route) {
  return Boolean(item.meta.single);
}

/**
 * 根据路由key获取AuthRoute数据
 * @param key - 路由key
 * @param routes - 路由
 */
export function findAuthRouteByKey(key: AuthRoute.RouteKey, routes: AuthRoute.Route[]) {
  const paths = getRouteKeyPathsByKey(key);
  const route = recursiveFindRouteByPaths(paths, routes);

  return route;
}

/**
 * 根据路由key的paths获递归取路由
 * @param paths - 路由key的路径
 * @param routes - 路由
 */
function recursiveFindRouteByPaths(
  paths: AuthRoute.RouteKey[],
  routes: AuthRoute.Route[]
): AuthRoute.Route | undefined {
  const item = routes.find(route => paths.length && route.name === paths[0]);

  if (item && hasComponent(item)) {
    return recursiveFindRouteByPaths(paths.slice(1), item.children!);
  }
  return item;
}

/**
 * 根据路由key获取从第一级路由到当前路由key的paths
 * @param key - 路由key
 */
function getRouteKeyPathsByKey(key: AuthRoute.RouteKey) {
  const splitMark: AuthRoute.RouteSplitMark = '_';
  const keys = key.split(splitMark);
  const keyPaths: AuthRoute.RouteKey[] = [];

  keys.forEach((itemKey, index) => {
    if (index === 0) {
      keyPaths.push(itemKey as AuthRoute.RouteKey);
    } else {
      const concatKey = keyPaths[index - 1] + splitMark + itemKey;
      keyPaths.push(concatKey as AuthRoute.RouteKey);
    }
  });

  return keyPaths;
}
