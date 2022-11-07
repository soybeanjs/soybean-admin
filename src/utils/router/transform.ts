import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import { BasicLayout, BlankLayout } from '@/layouts';
import { views } from '@/views';
import { isFunction } from '@/utils';

type Lazy<T> = () => Promise<T>;

type LayoutComponent = Record<EnumType.LayoutComponentName, Lazy<RouteComponent>>;

/**
 * 获取布局的vue文件(懒加载的方式)
 * @param layoutType - 布局类型
 */
export function getLayoutComponent(layoutType: EnumType.LayoutComponentName) {
  const layoutComponent: LayoutComponent = {
    basic: BasicLayout,
    blank: BlankLayout
  };
  return layoutComponent[layoutType];
}

/**
 * 获取页面导入的vue文件
 * @param routeKey - 路由key
 */
export function getViewComponent(routeKey: AuthRoute.LastDegreeRouteKey) {
  if (!views[routeKey]) {
    throw new Error(`路由“${routeKey}”没有对应的组件文件！`);
  }
  return setViewComponentName(views[routeKey], routeKey);
}

interface ModuleComponent {
  default: RouteComponent;
}

/** 给页面组件设置名称 */
function setViewComponentName(component: RouteComponent | Lazy<ModuleComponent>, name: string) {
  if (isAsyncComponent(component)) {
    return async () => {
      const result = await component();
      Object.assign(result.default, { name });
      return result;
    };
  }

  Object.assign(component, { name });

  return component;
}

function isAsyncComponent(component: RouteComponent | Lazy<ModuleComponent>): component is Lazy<ModuleComponent> {
  return isFunction(component);
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

/**
 * 将权限路由转换成vue路由
 * @param routes - 权限路由
 * @description 所有多级路由都会被转换成二级路由
 */
export function transformAuthRouteToVueRoutes(routes: AuthRoute.Route[]) {
  return routes.map(route => transformAuthRouteToVueRoute(route)).flat(1);
}

type ComponentAction = Record<AuthRoute.RouteComponentType, () => void>;

/**
 * 将单个权限路由转换成vue路由
 * @param item - 单个权限路由
 */
export function transformAuthRouteToVueRoute(item: AuthRoute.Route) {
  const resultRoute: RouteRecordRaw[] = [];

  const itemRoute = { ...item } as RouteRecordRaw;

  // 动态path
  if (hasDynamicPath(item)) {
    Object.assign(itemRoute, { path: item.meta.dynamicPath });
  }

  // 外链路由
  if (hasHref(item)) {
    Object.assign(itemRoute, { component: getViewComponent('404') });
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
          window.console.error('多级路由缺少子路由: ', item);
        }
      },
      self() {
        itemRoute.component = getViewComponent(item.name as AuthRoute.LastDegreeRouteKey);
      }
    };
    try {
      if (item.component) {
        action[item.component]();
      } else {
        window.console.error('路由组件解析失败: ', item);
      }
    } catch {
      window.console.error('路由组件解析失败: ', item);
    }
  }

  // 注意：单独路由没有children
  if (isSingleRoute(item)) {
    if (hasChildren(item)) {
      window.console.error('单独路由不应该有子路由: ', item);
    }

    // 捕获无效路由的需特殊处理
    if (item.name === 'not-found') {
      itemRoute.children = [
        {
          path: '',
          name: item.name,
          component: getViewComponent('not-found')
        }
      ];
    } else {
      const parentPath = `${itemRoute.path}-parent` as AuthRouteUtils.SingleRouteKey;

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
    const children = (item.children as AuthRoute.Route[]).map(child => transformAuthRouteToVueRoute(child)).flat();

    // 找出第一个不为多级路由中间级的子路由路径作为重定向路径
    const redirectPath = (children.find(v => !v.meta?.multi)?.path || '/') as AuthRoute.RoutePath;

    if (redirectPath === '/') {
      window.console.error('该多级路由没有有效的子路径', item);
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
