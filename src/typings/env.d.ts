/**
 * namespace Env
 * @description it is used to declare the type of the import.meta object
 */
declare namespace Env {
  /**
   * the router history mode
   */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  /**
   *  interface for import.meta
   */
  interface ImportMeta extends ImportMetaEnv {
    /**
     * the base url of the application
     */
    readonly VITE_BASE_URL: string;
    /**
     * the title of the application
     */
    readonly VITE_APP_TITLE: string;
    /**
     * the description of the application
     */
    readonly VITE_APP_DESC: string;
    /**
     * the router history mode
     */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode;
    /**
     * the prefix of the iconify icon
     */
    readonly VITE_ICON_PREFIX: 'icon';
    /**
     * the prefix of the local icon
     * @description this prefix is start with the icon prefix
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'local-icon';
    /**
     * whether to enable the http proxy
     * @description only valid in the development environment
     */
    readonly VITE_HTTP_PROXY?: Common.YesOrNo;
    /**
     * the back service env
     */
    readonly VITE_SERVICE_ENV?: App.Service.EnvType;
    /**
     * the auth route mode
     * - static: the auth routes is generated in front-end
     * - dynamic: the auth routes is generated in back-end
     */
    readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic';
    /**
     * the home route key
     * @description it only has effect when the auth route mode is static, if the route mode is dynamic, the home route key is defined in the back-end
     */
    readonly VITE_ROUTE_HOME: import('@elegant-router/types').LastLevelRouteKey;
    /**
     * default menu icon if menu icon is not set
     * @description iconify icon name
     */
    readonly VITE_MENU_ICON: string;
    /**
     * whether to build with sourcemap
     */
    readonly VITE_SOURCE_MAP?: Common.YesOrNo;
    /**
     * iconify api provider url
     * @description if the project is deployed in intranet, you can set the api provider url to the local iconify server
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string;
  }
}
