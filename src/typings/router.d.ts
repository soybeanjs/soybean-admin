import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * title of the route
     * @description it can be used in document title
     */
    title: string;
    /**
     * i18n key of the route
     * @description it's used in i18n, if it is set, the title will be ignored
     */
    i18nKey?: App.I18n.I18nKey;
    /**
     * roles of the route
     * @description route can be accessed if the current user has at least one of the roles
     */
    roles?: string[];
    /**
     * whether to cache the route
     */
    keepAlive?: boolean;
    /**
     * is constant route
     * @description does not need to login, and the route is defined in the front-end
     */
    constant?: boolean;
    /**
     * iconify icon
     * @description it can be used in the menu or breadcrumb
     */
    icon?: string;
    /**
     * local icon
     * @description in "src/assets/svg-icon", if it is set, the icon will be ignored
     */
    localIcon?: string;
    /**
     * router order
     */
    order?: number;
    /**
     * the outer link of the route
     */
    href?: string;
    /**
     * whether to hide the route in the menu
     */
    hideInMenu?: boolean;
    /**
     * the menu key will be activated when entering the route
     * @description the route is not in the menu
     * @example the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
     */
    activeMenu?: import('@elegant-router/types').LastLevelRouteKey;
    /**
     * by default, the same route path will use one tab, if set to true, it will use multiple tabs
     */
    multiTab?: boolean;
    /**
     * if set, the route will be fixed in tabs, and the value is the order of fixed tabs
     */
    fixedIndexInTab?: number;
  }
}
