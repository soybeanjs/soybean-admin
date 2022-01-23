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
  ComponentButton,
  ComponentCard,
  ComponentTable,
  PluginMap,
  PluginVideo,
  PluginEditorQuill,
  PluginEditorMarkdown,
  PluginSwiper,
  PluginCopy,
  PluginIcon,
  PluginPrint,
  MultiMenuFirstSecond,
  MultiMenuFirstSecondNewThird,
  About
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
  | 'component'
  | 'plugin'
  | 'plugin_editor'
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
    'component_button',
    'component_card',
    'component_table',
    'plugin_map',
    'plugin_video',
    'plugin_editor_quill',
    'plugin_editor_markdown',
    'plugin_copy',
    'plugin_icon',
    'plugin_print',
    'plugin_swiper',
    'exception_403',
    'exception_404',
    'exception_500',
    'multi-menu_first_second',
    'multi-menu_first_second-new_third',
    'about',
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
    component_button: ComponentButton,
    component_card: ComponentCard,
    component_table: ComponentTable,
    plugin_map: PluginMap,
    plugin_video: PluginVideo,
    plugin_editor_quill: PluginEditorQuill,
    plugin_editor_markdown: PluginEditorMarkdown,
    plugin_copy: PluginCopy,
    plugin_icon: PluginIcon,
    plugin_print: PluginPrint,
    plugin_swiper: PluginSwiper,
    exception_403: NoPermission,
    exception_404: NotFound,
    exception_500: ServiceError,
    'multi-menu_first_second': MultiMenuFirstSecond,
    'multi-menu_first_second-new_third': MultiMenuFirstSecondNewThird,
    about: About,
    'not-found-page': NotFound
  };

  return () => setViewComponentName(viewComponent[key], key) as Promise<Component>;
}

/** 给页面组件设置名称 */
async function setViewComponentName(asyncComponent: () => Promise<Component>, name: string) {
  const component = (await asyncComponent()) as { default: Component };
  Object.assign(component.default, { name });
  return component;
}
