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
  'dashboard-analysis' = '/dashboard/analysis',
  'dashboard-workbench' = '/dashboard/workbench',
  'exception' = '/exception',
  'exception-403' = '/exception/403',
  'exception-404' = '/exception/404',
  'exception-500' = '/exception/500'
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
  'dashboard-analysis' = '分析页',
  'dashboard-workbench' = '工作台',
  'exception' = '异常页',
  'exception-403' = '异常页-403',
  'exception-404' = '异常页-404',
  'exception-500' = '异常页-500'
}
