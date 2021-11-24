import type { RouteKey } from '@/interface';

interface RouteConst {
  /** 路由名称 */
  name: RouteKey;
  /** 路由路径 */
  path: string;
  /** 路由标题 */
  title: string;
}

/** 声明的路由名称、路径和标题 */
const routeConstMap = new Map<RouteKey, RouteConst>([
  [
    'root',
    {
      name: 'root',
      path: '/',
      title: 'Root'
    }
  ],
  [
    'login',
    {
      name: 'login',
      path: '/login',
      title: '登录'
    }
  ],
  [
    'no-permission',
    {
      name: 'no-permission',
      path: '/403',
      title: '无权限'
    }
  ],
  [
    'not-found',
    {
      name: 'not-found',
      path: '/404',
      title: '未找到'
    }
  ],
  [
    'service-error',
    {
      name: 'service-error',
      path: '/500',
      title: '服务器错误'
    }
  ],
  [
    'dashboard',
    {
      name: 'dashboard',
      path: '/dashboard',
      title: '仪表盘'
    }
  ],
  [
    'dashboard_analysis',
    {
      name: 'dashboard_analysis',
      path: '/dashboard/analysis',
      title: '分析页'
    }
  ],
  [
    'dashboard_workbench',
    {
      name: 'dashboard_workbench',
      path: '/dashboard/workbench',
      title: '工作台'
    }
  ],
  [
    'document',
    {
      name: 'document',
      path: '/document',
      title: '文档'
    }
  ],
  [
    'document_vue',
    {
      name: 'document_vue',
      path: '/document/vue',
      title: 'vue文档'
    }
  ],
  [
    'document_vite',
    {
      name: 'document_vite',
      path: '/document/vite',
      title: 'vite文档'
    }
  ],
  [
    'document_naive',
    {
      name: 'document_naive',
      path: '/document/naive',
      title: 'naive文档'
    }
  ],
  [
    'component',
    {
      name: 'component',
      path: '/component',
      title: '组件插件'
    }
  ],
  [
    'component_map',
    {
      name: 'component_map',
      path: '/component/map',
      title: '地图插件'
    }
  ],
  [
    'component_video',
    {
      name: 'component_video',
      path: '/component/video',
      title: '视频插件'
    }
  ],
  [
    'component_editor',
    {
      name: 'component_editor',
      path: '/component/editor',
      title: '编辑器'
    }
  ],
  [
    'component_editor_quill',
    {
      name: 'component_editor_quill',
      path: '/component/editor/quill',
      title: '富文本编辑器'
    }
  ],
  [
    'component_editor_markdown',
    {
      name: 'component_editor_markdown',
      path: '/component/editor/markdown',
      title: 'markdown编辑器'
    }
  ],
  [
    'component_swiper',
    {
      name: 'component_swiper',
      path: '/component/swiper',
      title: 'Swiper插件'
    }
  ],
  [
    'feat',
    {
      name: 'feat',
      path: '/feat',
      title: '功能示例'
    }
  ],
  [
    'feat_copy',
    {
      name: 'feat_copy',
      path: '/feat/copy',
      title: '剪贴板'
    }
  ],
  [
    'feat_icon',
    {
      name: 'feat_icon',
      path: '/feat/icon',
      title: '图标'
    }
  ],
  [
    'feat_print',
    {
      name: 'feat_print',
      path: '/feat/print',
      title: '打印'
    }
  ],
  [
    'multi-menu',
    {
      name: 'multi-menu',
      path: '/multi-menu',
      title: '多级菜单'
    }
  ],
  [
    'multi-menu_first',
    {
      name: 'multi-menu_first',
      path: '/multi-menu/first',
      title: '一级菜单'
    }
  ],
  [
    'multi-menu_first_second',
    {
      name: 'multi-menu_first_second',
      path: '/multi-menu/first/second',
      title: '二级菜单'
    }
  ],
  [
    'exception',
    {
      name: 'exception',
      path: '/exception',
      title: '异常页'
    }
  ],
  [
    'exception_403',
    {
      name: 'exception_403',
      path: '/exception/403',
      title: '异常页-403'
    }
  ],
  [
    'exception_404',
    {
      name: 'exception_404',
      path: '/exception/404',
      title: '异常页-404'
    }
  ],
  [
    'exception_500',
    {
      name: 'exception_500',
      path: '/exception/500',
      title: '异常页-500'
    }
  ],
  [
    'about',
    {
      name: 'about',
      path: '/about',
      title: '关于'
    }
  ],
  [
    'website',
    {
      name: 'website',
      path: '/website',
      title: '网址导航'
    }
  ]
]);

/** 获取路由的声明(name、path、title) */
export function getRouteConst(key: RouteKey) {
  return routeConstMap.get(key)!;
}
/** 路由名称 */
export function routeName(key: RouteKey) {
  return routeConstMap.get(key)!.name;
}
/** 路由路径 */
export function routePath(key: RouteKey) {
  return routeConstMap.get(key)!.path;
}
/** 路由标题 */
export function routeTitle(key: RouteKey) {
  return routeConstMap.get(key)!.title;
}
