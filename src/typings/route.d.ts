/** 权限路由相关类型 */
declare namespace AuthRoute {
  /** 多级路由分割符号 */
  type RouteSplitMark = '_';

  /** 路由的key */
  type RouteKey =
    // 固定的路由
    | 'root' // 根路由
    | 'login'
    | 'not-found'
    | 'no-permission'
    | 'service-error'
    | 'constant-page'
    | 'not-found-page' // 捕获无效path的路由
    // 自定义路由
    | 'dashboard'
    | 'dashboard_analysis'
    | 'dashboard_workbench'
    | 'document'
    | 'document_vue'
    | 'document_vite'
    | 'document_naive'
    | 'document_project'
    | 'document_project-link'
    | 'component'
    | 'component_button'
    | 'component_card'
    | 'component_table'
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
    | 'plugin_charts'
    | 'plugin_charts_echarts'
    | 'plugin_charts_antv'
    | 'auth-demo'
    | 'auth-demo_permission'
    | 'auth-demo_super'
    | 'function'
    | 'function_tab'
    | 'function_tab-detail'
    | 'function_tab-multi-detail'
    | 'exception'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'multi-menu'
    | 'multi-menu_first'
    | 'multi-menu_first_second'
    | 'multi-menu_first_second-new'
    | 'multi-menu_first_second-new_third'
    | 'management'
    | 'management_user'
    | 'management_role'
    | 'management_auth'
    | 'management_route'
    | 'about';

  /** 路由的path */
  type RoutePath =
    | '/'
    | Exclude<KeyToPath<RouteKey>, '/root' | 'not-found-page'>
    | SingleRouteParentPath
    | '/:pathMatch(.*)*';

  /**
   * 路由的组件
   * - basic - 基础布局，具有公共部分的布局
   * - blank - 空白布局
   * - multi - 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
   * - self - 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
   */
  type RouteComponent = 'basic' | 'blank' | 'multi' | 'self';

  /** 路由描述 */
  interface RouteMeta {
    /** 路由标题(可用来作document.title或者菜单的名称) */
    title: string;
    /** 路由的动态路径(需要动态路径的页面需要将path添加进范型参数) */
    dynamicPath?: PathToDynamicPath<'/login'>;
    /** 作为单级路由的父级路由布局组件 */
    singleLayout?: Extract<RouteComponent, 'basic' | 'blank'>;
    /** 需要登录权限 */
    requiresAuth?: boolean;
    /**
     * 哪些类型的用户有权限才能访问的路由(空的话则表示不需要权限)
     * @description 后端动态路由数据不需要该属性，直接由后端根据用户角色返回对应权限的路由数据
     */
    permissions?: Auth.RoleType[];
    /** 缓存页面 */
    keepAlive?: boolean;
    /** 菜单和面包屑对应的图标(iconify图标名称) */
    icon?: string;
    /** 使用本地svg作为的菜单和面包屑对应的图标(assets/svg-icon文件夹的的svg文件名) */
    localIcon?: string;
    /** 是否在菜单中隐藏(一些列表、表格的详情页面需要通过参数跳转，所以不能显示在菜单中) */
    hide?: boolean;
    /** 外链链接 */
    href?: string;
    /** 是否支持多个tab页签(默认一个，即相同name的路由会被替换) */
    multiTab?: boolean;
    /** 路由顺序，可用于菜单的排序 */
    order?: number;
    /** 当前路由需要选中的菜单项(用于跳转至不在左侧菜单显示的路由且需要高亮某个菜单的情况) */
    activeMenu?: RouteKey;
    /** 表示是否是多级路由的中间级路由(用于转换路由数据时筛选多级路由的标识，定义路由时不用填写) */
    multi?: boolean;
  }

  /** 单个路由的类型结构(动态路由模式：后端返回此类型结构的路由) */
  interface Route {
    /** 路由名称(路由唯一标识) */
    name: RouteKey;
    /** 路由路径 */
    path: RoutePath;
    /** 路由重定向 */
    redirect?: RoutePath;
    /**
     * 路由组件
     * - basic: 基础布局，具有公共部分的布局
     * - blank: 空白布局
     * - multi: 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
     * - self: 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
     */
    component?: RouteComponent;
    /** 子路由 */
    children?: Route[];
    /** 路由描述 */
    meta: RouteMeta;
    /** 路由属性 */
    props?: boolean | Record<string, any> | ((to: any) => Record<string, any>);
  }

  /** 前端导入的路由模块 */
  type RouteModule = Record<string, { default: AuthRoute.Route }>;

  /** 单独一级路由的key (单独路由需要添加一个父级路由用于应用布局组件) */
  type SingleRouteKey = Exclude<
    GetSingleRouteKey<RouteKey>,
    GetRouteFirstParentKey<RouteKey> | 'root' | 'not-found-page'
  >;
  /** 单独路由父级路由key */
  type SingleRouteParentKey = `${SingleRouteKey}-parent`;

  /** 单独路由父级路由path */
  type SingleRouteParentPath = KeyToPath<SingleRouteParentKey>;

  /** 路由key转换路由path */
  type KeyToPath<Key extends string> = Key extends `${infer Left}_${infer Right}`
    ? KeyToPath<`${Left}/${Right}`>
    : `/${Key}`;

  /** 路由path转换动态路径 */
  type PathToDynamicPath<Path extends RoutePath> =
    | `${Path}/:${string}`
    | `${Path}/:${string}(${string})`
    | `${Path}/:${string}(${string})?`;

  /** 获取一级路由(包括有子路由的一级路由) */
  type GetSingleRouteKey<Key extends RouteKey> = Key extends `${infer _Left}${RouteSplitMark}${infer _Right}`
    ? never
    : Key;

  /** 获取子路由的一级父路由 */
  type GetRouteFirstParentKey<Key extends RouteKey> = Key extends `${infer Left}${RouteSplitMark}${infer _Right}`
    ? Left
    : never;
}
