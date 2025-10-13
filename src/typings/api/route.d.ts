declare namespace Api {
  namespace Route {
    interface RouteDTO extends Common.CommonRecordDTO {
      /** 路由路径 */
      path: string;
      /** 路由名称 */
      name: string;
      /** 路由布局 */
      layout: string;
      /** 路由组件 */
      component: string;
      /** 重定向路径 */
      redirect?: string | null;
      /** 路由图标 */
      icon?: string | null;
      /** 路由图标类型 */
      iconType?: string | null;
      /** 是否缓存 */
      isCache?: boolean | null;
      /** 是否支持多开 */
      isMultiple?: boolean | null;
      /** 固定索引 */
      fixedIndex?: number | null;
      /** 是否需要权限 */
      requireAuth?: boolean | null;
      /** 路由属性 */
      props?: Record<string, string | number | boolean> | null;
    }

    interface RouteListDTO extends Common.PaginationDTO {
      list: RouteDTO[];
    }
  }
}
