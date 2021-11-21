import type { RouteRecordRaw } from 'vue-router';

/** 路由描述 */
export interface CustomRouteMeta {
  /** 路由名称 */
  title?: string;
  /** 缓存页面 */
  keepAlive?: boolean;
  /** 页面100%视高 */
  fullPage?: boolean;
  /** 不作为菜单 */
  isNotMenu?: boolean;
  /** 菜单和面包屑对应的图标 */
  icon?: string;
  /** 导入的路由模块排序，可用于菜单的排序 */
  order?: number;
}

/** 路由配置 */
export type CustomRoute = RouteRecordRaw & { meta: CustomRouteMeta };

/** 导入的路由模块 */
export type ImportedRouteModules = Record<string, { default: CustomRoute; [key: string]: any }>;

/** 路由声明的key */
export type RouteKey =
  | 'root'
  | 'login'
  | 'not-found'
  | 'no-permission'
  | 'service-error'
  // 自定义路由
  | 'dashboard'
  | 'dashboard_analysis'
  | 'dashboard_workbench'
  | 'document'
  | 'document_vue'
  | 'document_vite'
  | 'document_naive'
  | 'component'
  | 'component_map'
  | 'component_video'
  | 'component_editor'
  | 'component_editor_quill'
  | 'component_editor_markdown'
  | 'component_swiper'
  | 'feat'
  | 'feat_copy'
  | 'feat_icon'
  | 'feat_print'
  | 'multi-menu'
  | 'multi-menu_first'
  | 'multi-menu_first_second'
  | 'exception'
  | 'exception_403'
  | 'exception_404'
  | 'exception_500'
  | 'about';
