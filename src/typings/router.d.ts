import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由名称(作为菜单时为菜单的名称) */
    title: string;
    /** 需要登录权限 */
    requiresAuth?: boolean;
    /** 缓存页面 */
    keepAlive?: boolean;
    /** 页面占满剩余高度(去除头部、tab和底部后的高度) */
    fullPage?: boolean;
    /** 不作为菜单 */
    notAsMenu?: boolean;
    /** 菜单和面包屑对应的图标 */
    icon?: string;
    /** 导入的路由模块排序，可用于菜单的排序 */
    order?: number;
    /** y方向滚动的距离(被缓存的页面保留滚动行为) */
    scrollY?: number;
  }
}
