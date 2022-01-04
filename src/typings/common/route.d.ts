/** 权限路由相关类型 */
declare namespace AuthRoute {
  /** 路由的key */
  type RouteKey =
    // 固定的路由
    | 'root'
    | 'login'
    | 'not-found'
    | 'no-permission'
    | 'service-error'
    | 'redirect-not-found' // 重定向not-found
    // 自定义路由
    | 'dashboard'
    | 'dashboard_analysis'
    | 'dashboard_workbench'
    | 'multi-menu'
    | 'multi-menu_first'
    | 'multi-menu_first_second'
    | 'about';

  /** 路由Key转换路由Path */
  type KeyToPath<Key extends string> = Key extends `${infer Left}_${infer Right}`
    ? KeyToPath<`${Left}/${Right}`>
    : `/${Key}`;

  /** 路由路径 */
  type RoutePath<Key extends string = string> =
    | '/'
    | Exclude<KeyToPath<RouteKey>, '/root' | '/redirect'>
    | Key
    | '/:path(.*)*'
    | '/:pathMatch(.*)*';

  /** 多级路由分割符号 */
  type RouteSplitMark = '_';

  /**
   * 路由的组件
   * - layout - 基础布局，具有公共部分的布局
   * - blank - 空白布局
   * - multi - 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
   * - self - 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
   */
  type RouteComponent = 'layout' | 'blank' | 'multi' | 'self';

  /** 路由描述 */
  type RouteMeta = {
    /** 路由标题(可用来作document.title或者菜单的名称) */
    title: string;
    /** 需要登录权限 */
    requiresAuth?: boolean;
    /** 哪些类型的用户有权限才能访问的路由 */
    permissions?: Auth.RoleType[];
    /** 缓存页面 */
    keepAlive?: boolean;
    /** 是否是空白布局 */
    blankLayout?: boolean;
    /** 菜单和面包屑对应的图标 */
    icon?: string;
    /** 是否在菜单中隐藏 */
    hide?: boolean;
    /** 是否作为单独的路由(作为菜单时只有自身，没有子菜单) */
    single?: boolean;
    /** 路由顺序，可用于菜单的排序 */
    order?: number;
  };

  /** 单个路由的类型结构(后端返回此类型结构的路由) */
  interface Route<T extends string = ''> {
    /** 路由名称(路由唯一标识) */
    name: RouteKey;
    /** 路由路径 */
    path: RoutePath<T>;
    /** 路由重定向 */
    redirect?: RoutePath;
    /**
     * 路由组件
     * - layout: 基础布局，具有公共部分的布局
     * - blank: 空白布局
     * - multi: 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
     * - self: 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
     */
    component?: RouteComponent;
    /** 子路由 */
    children?: Route[];
    /** 路由描述 */
    meta: RouteMeta;
  }
}
