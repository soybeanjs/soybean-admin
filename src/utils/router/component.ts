import type { Component } from 'vue';
import {
  Login,
  NoPermission,
  NotFound,
  ServiceError,
  DashboardAnalysis,
  DashboardWorkbench,
  About,
  MultiMenuFirstSecond
} from '@/views';

/** 需要用到自身vue组件的页面 */
type ViewComponentKey = Exclude<AuthRoute.RouteKey, 'root' | 'dashboard' | 'multi-menu' | 'multi-menu_first'>;

type ViewComponent = {
  [key in ViewComponentKey]: () => Promise<Component>;
};

/**
 * 获取页面导入的vue文件(懒加载的方式)
 */
export function getViewComponent(routeKey: AuthRoute.RouteKey) {
  const keys: ViewComponentKey[] = [
    'login',
    'no-permission',
    'not-found',
    'service-error',
    'dashboard_analysis',
    'dashboard_workbench',
    'about',
    'multi-menu_first_second',
    'redirect-not-found'
  ];

  const key = keys.includes(routeKey as ViewComponentKey) ? (routeKey as ViewComponentKey) : 'not-found';

  const viewComponent: ViewComponent = {
    login: Login,
    'no-permission': NoPermission,
    'not-found': NotFound,
    'service-error': ServiceError,
    dashboard_analysis: DashboardAnalysis,
    dashboard_workbench: DashboardWorkbench,
    about: About,
    'multi-menu_first_second': MultiMenuFirstSecond,
    'redirect-not-found': NotFound
  };

  return () => setViewComponentName(viewComponent[key], key);
}

/** 给页面组件设置名称 */
async function setViewComponentName(asyncComponent: () => Promise<Component>, name: string) {
  const component = (await asyncComponent()) as { default: Component };
  Object.assign(component.default, { name });
  return component;
}
