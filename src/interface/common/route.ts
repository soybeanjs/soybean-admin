import type { RouteRecordRaw } from 'vue-router';

/** 导入的路由模块 */
export type ImportedRouteModules = Record<string, { default: RouteRecordRaw; [key: string]: any }>;

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
  | 'about'
  | 'website';
