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
  | 'document_project'
  | 'plugin'
  | 'plugin_map'
  | 'plugin_video'
  | 'plugin_editor'
  | 'plugin_editor_quill'
  | 'plugin_editor_markdown'
  | 'plugin_copy'
  | 'plugin_icon'
  | 'plugin_print'
  | 'plugin_swiper'
  | 'component'
  | 'component_button'
  | 'component_card'
  | 'component_table'
  | 'multi-menu'
  | 'multi-menu_first'
  | 'multi-menu_first_second'
  | 'exception'
  | 'exception_403'
  | 'exception_404'
  | 'exception_500'
  | 'about'
  | 'website';
