declare namespace Api {
  namespace Menu {
    type RouteKey = import('@elegant-router/types').RouteKey;

    interface Menu extends Common.CommonRecordDTO {
      /** 菜单名称 */
      name: string;
      /** 菜单类型 */
      menuType: Union.MenuType;
      /** 菜单描述 */
      description?: string | null;
      /** 菜单图标 */
      icon?: string | null;
      /** 菜单图标类型 */
      iconType?: string | null;
      /** 父级菜单ID */
      parentId?: number | null;
      /** 菜单排序 */
      order?: number | null;
      /** 是否隐藏 */
      isHidden?: boolean | null;
      /** iframe 页面URL */
      iframeUrl?: string | null;
      /** 链接 */
      href?: string | null;
      /** 路由名称 */
      routeName?: RouteKey | null;
      /** 路由查询参数 */
      routeQueries?: Record<string, string | number | boolean> | null;
      /** 路由路径参数 */
      routeParams?: Record<string, string | number | boolean> | null;
    }

    interface MenuListDTO extends Common.PaginationDTO {
      list: Menu[];
    }

    interface MenuTreeDTO extends Menu {
      children?: MenuTreeDTO[];
    }
  }
}
