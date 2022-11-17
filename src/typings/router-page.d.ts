declare namespace RouterPage {
  /** 根路由 */
  type RootRouteKey = 'root';

  /** 未找到路由(捕获无效路径的路由) */
  type NotFoundRouteKey = 'not-found';

  /** 页面路由 */
  type RouteKey =
    | '403'
    | '404'
    | '500'
    | 'about'
    | 'auth-demo'
    | 'auth-demo_permission'
    | 'auth-demo_super'
    | 'component'
    | 'component_button'
    | 'component_card'
    | 'component_table'
    | 'constant-page'
    | 'dashboard'
    | 'dashboard_analysis'
    | 'dashboard_workbench'
    | 'document'
    | 'document_naive'
    | 'document_project'
    | 'document_project-link'
    | 'document_vite'
    | 'document_vue'
    | 'exception'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'function'
    | 'function_tab'
    | 'function_tab-detail'
    | 'function_tab-multi-detail'
    | 'login'
    | 'management'
    | 'management_auth'
    | 'management_role'
    | 'management_route'
    | 'management_user'
    | 'multi-menu'
    | 'multi-menu_first'
    | 'multi-menu_first_second'
    | 'multi-menu_first_second-new'
    | 'multi-menu_first_second-new_third'
    | 'not-found'
    | 'plugin'
    | 'plugin_charts'
    | 'plugin_charts_antv'
    | 'plugin_charts_echarts'
    | 'plugin_copy'
    | 'plugin_editor'
    | 'plugin_editor_markdown'
    | 'plugin_editor_quill'
    | 'plugin_icon'
    | 'plugin_map'
    | 'plugin_print'
    | 'plugin_swiper'
    | 'plugin_video';

  /** 最后一级路由(该级路有对应的vue文件) */
  type LastDegreeRouteKey = Extract<RouteKey, '403' | '404' | '500' | 'about' | 'auth-demo_permission' | 'auth-demo_super' | 'component_button' | 'component_card' | 'component_table' | 'constant-page' | 'dashboard_analysis' | 'dashboard_workbench' | 'document_naive' | 'document_project' | 'document_project-link' | 'document_vite' | 'document_vue' | 'exception_403' | 'exception_404' | 'exception_500' | 'function_tab' | 'function_tab-detail' | 'function_tab-multi-detail' | 'login' | 'management_auth' | 'management_role' | 'management_route' | 'management_user' | 'multi-menu_first_second' | 'multi-menu_first_second-new_third' | 'not-found' | 'plugin_charts_antv' | 'plugin_charts_echarts' | 'plugin_copy' | 'plugin_editor_markdown' | 'plugin_editor_quill' | 'plugin_icon' | 'plugin_map' | 'plugin_print' | 'plugin_swiper' | 'plugin_video'>
}
