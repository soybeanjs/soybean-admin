/**
 * 命名空间 Env
 *
 * 用于声明 import.meta 对象的类型
 */
declare namespace Env {
  /** 路由历史模式 */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  /** import.meta 的接口 */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ImportMeta extends ImportMetaEnv {
    /** 应用的基础路径 */
    readonly VITE_BASE_URL: string;
    /** 应用标题 */
    readonly VITE_APP_TITLE: string;
    /** 应用描述 */
    readonly VITE_APP_DESC: string;
    /** 路由历史模式 */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode;
    /** iconify 图标前缀 */
    readonly VITE_ICON_PREFIX: 'icon';
    /**
     * 本地图标前缀
     *
     * 该前缀以 icon 前缀开头
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'icon-local';
    /** 后端服务基础地址 */
    readonly VITE_SERVICE_BASE_URL: string;
    /**
     * 后端服务成功状态码
     *
     * 收到该状态码时，请求成功
     */
    readonly VITE_SERVICE_SUCCESS_CODE: string;
    /**
     * 后端服务登出状态码
     *
     * 收到该状态码时，用户会被登出并跳转到登录页
     *
     * 多个状态码用 "," 分隔
     */
    readonly VITE_SERVICE_LOGOUT_CODES: string;
    /**
     * 后端服务弹窗登出状态码
     *
     * 收到该状态码时，会弹窗提示并登出
     *
     * 多个状态码用 "," 分隔
     */
    readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string;
    /**
     * 后端服务 token 过期状态码
     *
     * 收到该状态码时，会刷新 token 并重新发送请求
     *
     * 多个状态码用 "," 分隔
     */
    readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string;
    /** 路由模式为 static 时定义的超级角色 */
    readonly VITE_STATIC_SUPER_ROLE: string;
    /**
     * 其他后端服务基础地址
     *
     * 值为 json 格式
     */
    readonly VITE_OTHER_SERVICE_BASE_URL: string;
    /**
     * 是否启用 http 代理
     *
     * 仅在开发环境下有效
     */
    readonly VITE_HTTP_PROXY?: CommonType.YesOrNo;
    /**
     * 权限路由模式
     *
     * - static：前端生成权限路由
     * - dynamic：后端生成权限路由
     */
    readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic';
    /**
     * 首页路由 key
     *
     * 仅在权限路由模式为 static 时生效，dynamic 时由后端定义
     */
    readonly VITE_ROUTE_HOME: import('@elegant-router/types').LastLevelRouteKey;
    /**
     * 默认菜单图标（未设置菜单图标时使用）
     *
     * Iconify 图标名
     */
    readonly VITE_MENU_ICON: string;
    /** 是否构建 sourcemap */
    readonly VITE_SOURCE_MAP?: CommonType.YesOrNo;
    /**
     * Iconify API 提供者地址
     *
     * 如果项目部署在内网，可设置为本地 iconify 服务地址
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string;
    /** 用于区分不同域名下的存储 */
    readonly VITE_STORAGE_PREFIX?: string;
    /** 配置应用打包后是否自动检测更新 */
    readonly VITE_AUTOMATICALLY_DETECT_UPDATE?: CommonType.YesOrNo;
    /** 是否在终端显示代理地址日志 */
    readonly VITE_PROXY_LOG?: CommonType.YesOrNo;
    /** 启动的编辑器 */
    readonly VITE_DEVTOOLS_LAUNCH_EDITOR?: import('vite-plugin-vue-devtools').VitePluginVueDevToolsOptions['launchEditor'];
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}
