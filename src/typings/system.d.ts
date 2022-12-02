/** 枚举的key类型 */
declare namespace EnumType {
  /** 布局组件名称 */
  type LayoutComponentName = keyof typeof import('@/enum').EnumLayoutComponentName;

  /** 布局模式 */
  type ThemeLayoutMode = keyof typeof import('@/enum').EnumThemeLayoutMode;

  /** 多页签风格 */
  type ThemeTabMode = keyof typeof import('@/enum').EnumThemeTabMode;

  /** 水平模式的菜单位置 */
  type ThemeHorizontalMenuPosition = keyof typeof import('@/enum').EnumThemeHorizontalMenuPosition;

  /** 过渡动画 */
  type ThemeAnimateMode = keyof typeof import('@/enum').EnumThemeAnimateMode;

  /** 登录模块 */
  type LoginModuleKey = keyof typeof import('@/enum').EnumLoginModule;
}

/** 请求的相关类型 */
declare namespace Service {
  /**
   * 请求的错误类型：
   * - axios: axios错误：网络错误, 请求超时, 默认的兜底错误
   * - http: 请求成功，响应的http状态码非200的错误
   * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
   */
  type RequestErrorType = 'axios' | 'http' | 'backend';

  /** 请求错误 */
  interface RequestError {
    /** 请求服务的错误类型 */
    type: RequestErrorType;
    /** 错误码 */
    code: string | number;
    /** 错误信息 */
    msg: string;
  }

  /** 后端接口返回的数据结构配置 */
  interface BackendResultConfig {
    /** 表示后端请求状态码的属性字段 */
    codeKey: string;
    /** 表示后端请求数据的属性字段 */
    dataKey: string;
    /** 表示后端消息的属性字段 */
    msgKey: string;
    /** 后端业务上定义的成功请求的状态 */
    successCode: number | string;
  }

  /** 自定义的请求成功结果 */
  interface SuccessResult<T = any> {
    /** 请求错误 */
    error: null;
    /** 请求数据 */
    data: T;
  }

  /** 自定义的请求失败结果 */
  interface FailedResult {
    /** 请求错误 */
    error: RequestError;
    /** 请求数据 */
    data: null;
  }

  /** 自定义的请求结果 */
  type RequestResult<T = any> = SuccessResult<T> | FailedResult;

  /** 多个请求数据结果 */
  type MultiRequestResult<T extends any[]> = T extends [infer First, ...infer Rest]
    ? [First] extends [any]
      ? Rest extends any[]
        ? [Service.RequestResult<First>, ...MultiRequestResult<Rest>]
        : [Service.RequestResult<First>]
      : Rest extends any[]
      ? MultiRequestResult<Rest>
      : []
    : [];

  /** 请求结果的适配器函数 */
  type ServiceAdapter<T = any, A extends any[] = any> = (...args: A) => T;

  /** mock示例接口类型：后端接口返回的数据的类型 */
  interface MockServiceResult<T = any> {
    /** 状态码 */
    code: string | number;
    /** 接口数据 */
    data: T;
    /** 接口消息 */
    message: string;
  }

  /** mock的响应option */
  interface MockOption {
    url: Record<string, any>;
    body: Record<string, any>;
    query: Record<string, any>;
    headers: Record<string, any>;
  }
}

/** 主题相关类型 */
declare namespace Theme {
  /** 主题配置 */
  interface Setting {
    /** 暗黑模式 */
    darkMode: boolean;
    /** 是否自动跟随系统主题 */
    followSystemTheme: boolean;
    /** 布局样式 */
    layout: Layout;
    /** 主题颜色 */
    themeColor: string;
    /** 主题颜色列表 */
    themeColorList: string[];
    /** 其他颜色 */
    otherColor: OtherColor;
    /** 是否自定义info的颜色(默认取比主题色深一级的颜色) */
    isCustomizeInfoColor: boolean;
    /** 固定头部和多页签 */
    fixedHeaderAndTab: boolean;
    /** 显示重载按钮 */
    showReload: boolean;
    /** 头部样式 */
    header: Header;
    /** 标多页签样式 */
    tab: Tab;
    /** 侧边栏样式 */
    sider: Sider;
    /** 菜单样式 */
    menu: Menu;
    /** 底部样式 */
    footer: Footer;
    /** 页面样式 */
    page: Page;
  }
  /** 布局样式 */
  interface Layout {
    /** 最小宽度 */
    minWidth: number;
    /** 布局模式 */
    mode: EnumType.ThemeLayoutMode;
    /** 布局模式列表 */
    modeList: LayoutModeList[];
  }
  interface LayoutModeList {
    value: EnumType.ThemeLayoutMode;
    label: import('@/enum').EnumThemeLayoutMode;
  }

  /** 其他主题颜色 */
  interface OtherColor {
    /** 信息 */
    info: string;
    /** 成功 */
    success: string;
    /** 警告 */
    warning: string;
    /** 错误 */
    error: string;
  }

  /** 头部样式 */
  interface Header {
    /** 头部反转色 */
    inverted: boolean;
    /** 头部高度 */
    height: number;
    /** 面包屑样式 */
    crumb: Crumb;
  }
  /** 面包屑样式 */
  interface Crumb {
    /** 面包屑可见 */
    visible: boolean;
    /** 显示图标 */
    showIcon: boolean;
  }

  /** 标多页签样式 */
  export interface Tab {
    /** 多页签可见 */
    visible: boolean;
    /** 多页签高度 */
    height: number;
    /** 多页签风格 */
    mode: EnumType.ThemeTabMode;
    /** 多页签风格列表 */
    modeList: ThemeTabModeList[];
    /** 开启多页签缓存 */
    isCache: boolean;
  }

  /** 多页签风格列表 */
  interface ThemeTabModeList {
    value: EnumType.ThemeTabMode;
    label: import('@/enum').EnumThemeTabMode;
  }

  /** 侧边栏样式 */
  interface Sider {
    /** 侧边栏反转色 */
    inverted: boolean;
    /** 侧边栏宽度 */
    width: number;
    /** 侧边栏折叠时的宽度 */
    collapsedWidth: number;
    /** vertical-mix模式下侧边栏宽度 */
    mixWidth: number;
    /** vertical-mix模式下侧边栏折叠时的宽度 */
    mixCollapsedWidth: number;
    /** vertical-mix模式下侧边栏的子菜单的宽度 */
    mixChildMenuWidth: number;
  }

  /** 菜单样式 */
  interface Menu {
    /** 水平模式的菜单的位置 */
    horizontalPosition: EnumType.ThemeHorizontalMenuPosition;
    /** 水平模式的菜单的位置列表 */
    horizontalPositionList: HorizontalMenuPositionList[];
  }
  /** 水平模式的菜单的位置列表 */
  interface HorizontalMenuPositionList {
    value: EnumType.ThemeHorizontalMenuPosition;
    label: import('@/enum').EnumThemeHorizontalMenuPosition;
  }

  /** 底部样式 */
  interface Footer {
    /** 是否固定底部 */
    fixed: boolean;
    /** 底部高度 */
    height: number;
    /* 底部是否可见 */
    visible: boolean;
  }

  /** 页面样式 */
  interface Page {
    /** 页面是否开启动画 */
    animate: boolean;
    /** 动画类型 */
    animateMode: EnumType.ThemeAnimateMode;
    /** 动画类型列表 */
    animateModeList: AnimateModeList[];
  }
  /** 动画类型列表 */
  interface AnimateModeList {
    value: EnumType.ThemeAnimateMode;
    label: import('@/enum').EnumThemeAnimateMode;
  }
}

declare namespace App {
  /** 全局头部属性 */
  interface GlobalHeaderProps {
    /** 显示logo */
    showLogo: boolean;
    /** 显示头部菜单 */
    showHeaderMenu: boolean;
    /** 显示菜单折叠按钮 */
    showMenuCollapse: boolean;
  }

  /** 菜单项配置 */
  type GlobalMenuOption = import('naive-ui').MenuOption & {
    key: string;
    label: string;
    routeName: string;
    routePath: string;
    icon?: () => import('vue').VNodeChild;
    children?: GlobalMenuOption[];
  };

  /** 面包屑 */
  type GlobalBreadcrumb = import('naive-ui').DropdownOption & {
    key: string;
    label: string;
    disabled: boolean;
    routeName: string;
    hasChildren: boolean;
    children?: GlobalBreadcrumb[];
  };

  /** 多页签Tab的路由 */
  interface GlobalTabRoute
    extends Pick<import('vue-router').RouteLocationNormalizedLoaded, 'name' | 'fullPath' | 'meta'> {
    /** 滚动的位置 */
    scrollPosition: {
      left: number;
      top: number;
    };
  }

  interface MessageTab {
    /** tab的key */
    key: number;
    /** tab名称 */
    name: string;
    /** badge类型 */
    badgeProps?: import('naive-ui').BadgeProps;
    /** 消息数据 */
    list: MessageList[];
  }

  interface MessageList {
    /** 数据唯一值 */
    id: number;
    /** 头像 */
    avatar?: string;
    /** 消息icon */
    icon?: string;
    svgIcon?: string;
    /** 消息标题 */
    title: string;
    /** 消息发送时间 */
    date?: string;
    /** 消息是否已读 */
    isRead?: boolean;
    /** 消息描述 */
    description?: string;
    /** 标签名称 */
    tagTitle?: string;
    /** 标签props */
    tagProps?: import('naive-ui').TagProps;
  }
}

declare namespace I18nType {
  interface Schema {
    system: {
      title: string;
    };
    routes: {
      dashboard: {
        dashboard: string;
        analysis: string;
        workbench: string;
      };
      about: {
        about: string;
      };
    };
  }
}
