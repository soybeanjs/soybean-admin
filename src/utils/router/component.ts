import type { Component } from 'vue';
import { EnumLayoutComponentName } from '@/enum';
import { BasicLayout, BlankLayout } from '@/layouts';
import {
  Login,
  NoPermission,
  NotFound,
  ServiceError,
  DashboardAnalysis,
  DashboardWorkbench,
  DocumentVue,
  DocumentVueNew,
  DocumentVite,
  DocumentNaive,
  About,
  MultiMenuFirstSecond,
  MultiMenuFirstSecondNewThird
} from '@/views';
import type { LayoutComponentName } from '@/interface';

type LayoutComponent = Record<LayoutComponentName, () => Promise<Component>>;

/**
 * 获取页面导入的vue文件(懒加载的方式)
 * @param layoutType - 布局类型
 */
export function getLayoutComponent(layoutType: LayoutComponentName) {
  const layoutComponent: LayoutComponent = {
    basic: BasicLayout,
    blank: BlankLayout
  };
  return () => setViewComponentName(layoutComponent[layoutType], EnumLayoutComponentName[layoutType]);
}

/** 需要用到自身vue组件的页面 */
type ViewComponentKey = Exclude<
  AuthRoute.RouteKey,
  | 'root'
  | 'dashboard'
  | 'document'
  | 'document_project'
  | 'multi-menu'
  | 'multi-menu_first'
  | 'multi-menu_first_second-new'
  | 'exception'
>;

type ViewComponent = Record<ViewComponentKey, () => Promise<Component>>;

/**
 * 获取页面导入的vue文件(懒加载的方式)
 * @param routeKey - 路由key
 */
export function getViewComponent(routeKey: AuthRoute.RouteKey) {
  const keys: ViewComponentKey[] = [
    'login',
    'no-permission',
    'not-found',
    'service-error',
    'dashboard_analysis',
    'dashboard_workbench',
    'document_vue',
    'document_vue-new',
    'document_vite',
    'document_naive',
    'about',
    'multi-menu_first_second',
    'multi-menu_first_second-new_third',
    'exception_403',
    'exception_404',
    'exception_500',
    'not-found-page'
  ];

  const key = keys.includes(routeKey as ViewComponentKey) ? (routeKey as ViewComponentKey) : 'not-found';

  const viewComponent: ViewComponent = {
    login: Login,
    'no-permission': NoPermission,
    'not-found': NotFound,
    'service-error': ServiceError,
    dashboard_analysis: DashboardAnalysis,
    dashboard_workbench: DashboardWorkbench,
    document_vue: DocumentVue,
    'document_vue-new': DocumentVueNew,
    document_vite: DocumentVite,
    document_naive: DocumentNaive,
    'multi-menu_first_second': MultiMenuFirstSecond,
    'multi-menu_first_second-new_third': MultiMenuFirstSecondNewThird,
    'not-found-page': NotFound,
    exception_403: NoPermission,
    exception_404: NotFound,
    exception_500: ServiceError,
    about: About
  };

  return () => setViewComponentName(viewComponent[key], key) as Promise<Component>;
}

/** 给页面组件设置名称 */
async function setViewComponentName(asyncComponent: () => Promise<Component>, name: string) {
  const component = (await asyncComponent()) as { default: Component };
  Object.assign(component.default, { name });
  return component;
}
