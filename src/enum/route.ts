export enum EnumRoutePath {
  'root' = '/',
  'system' = '/system',
  'login' = '/login',
  'not-found' = '/404',
  'no-permission' = '/403',
  'service-error' = '/500',
  'reload' = '/reload',
  // 自定义路由
  'dashboard' = '/dashboard',
  'dashboard_analysis' = '/dashboard/analysis',
  'dashboard_workbench' = '/dashboard/workbench',
  'multi-menu' = '/multi-menu',
  'multi-menu_first' = '/multi-menu/first',
  'multi-menu_first_second' = '/multi-menu/first/second',
  'exception' = '/exception',
  'exception_403' = '/exception/403',
  'exception_404' = '/exception/404',
  'exception_500' = '/exception/500'
}

export enum EnumRouteTitle {
  'root' = 'root',
  'system' = '系统',
  'login' = '登录',
  'not-found' = '未找到',
  'no-permission' = '无权限',
  'service-error' = '服务器错误',
  'reload' = '重载',
  // 自定义路由
  'dashboard' = '仪表盘',
  'dashboard_analysis' = '分析页',
  'dashboard_workbench' = '工作台',
  'multi-menu' = '多级菜单',
  'multi-menu_first' = '一级菜单',
  'multi-menu_first_second' = '二级菜单',
  'exception' = '异常页',
  'exception_403' = '异常页-403',
  'exception_404' = '异常页-404',
  'exception_500' = '异常页-500'
}
