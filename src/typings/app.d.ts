/** 应用全局命名空间 */
declare namespace App {
  /** 主题命名空间 */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber;

    /** 主题设置 */
    interface ThemeSetting {
      /** 主题方案 */
      themeScheme: UnionKey.ThemeScheme;
      /** 灰度模式 */
      grayscale: boolean;
      /** 色弱模式 */
      colourWeakness: boolean;
      /** 是否推荐配色 */
      recommendColor: boolean;
      /** 主题色 */
      themeColor: string;
      /** 其他颜色 */
      otherColor: OtherColor;
      /** info颜色是否跟随主色 */
      isInfoFollowPrimary: boolean;
      /** 重置缓存策略 */
      resetCacheStrategy: UnionKey.ResetCacheStrategy;
      /** 布局 */
      layout: {
        /** 布局模式 */
        mode: UnionKey.ThemeLayoutMode;
        /** 滚动模式 */
        scrollMode: UnionKey.ThemeScrollMode;
        /**
         * 是否反转横向混合
         *
         * 如果为 true，左侧为垂直子菜单，顶部为横向一级菜单
         */
        reverseHorizontalMix: boolean;
      };
      /** 页面 */
      page: {
        /** 是否显示页面切换动画 */
        animate: boolean;
        /** 页面动画模式 */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** 顶栏 */
      header: {
        /** 顶栏高度 */
        height: number;
        /** 顶栏面包屑 */
        breadcrumb: {
          /** 是否显示面包屑 */
          visible: boolean;
          /** 是否显示面包屑图标 */
          showIcon: boolean;
        };
        /** 多语言 */
        multilingual: {
          /** 是否显示多语言 */
          visible: boolean;
        };
        globalSearch: {
          /** 是否显示全局搜索 */
          visible: boolean;
        };
      };
      /** 标签栏 */
      tab: {
        /** 是否显示标签栏 */
        visible: boolean;
        /**
         * 是否缓存标签页
         *
         * 如果缓存，刷新页面时标签页会从本地存储中获取
         */
        cache: boolean;
        /** 标签栏高度 */
        height: number;
        /** 标签栏模式 */
        mode: UnionKey.ThemeTabMode;
      };
      /** 固定头部和标签栏 */
      fixedHeaderAndTab: boolean;
      /** 侧边栏 */
      sider: {
        /** 侧边栏反色 */
        inverted: boolean;
        /** 侧边栏宽度 */
        width: number;
        /** 侧边栏收起宽度 */
        collapsedWidth: number;
        /** 混合布局下侧边栏宽度 */
        mixWidth: number;
        /** 混合布局下收起宽度 */
        mixCollapsedWidth: number;
        /** 混合布局下子菜单宽度 */
        mixChildMenuWidth: number;
      };
      /** 页脚 */
      footer: {
        /** 是否显示页脚 */
        visible: boolean;
        /** 是否固定页脚 */
        fixed: boolean;
        /** 页脚高度 */
        height: number;
        /** 混合布局下页脚是否右浮动 */
        right: boolean;
      };
      /** 水印 */
      watermark: {
        /** 是否显示水印 */
        visible: boolean;
        /** 水印文本 */
        text: string;
        /** 是否使用用户名作为水印文本 */
        enableUserName: boolean;
      };
      /** 定义部分主题 token，会转换为 css 变量 */
      tokens: {
        light: ThemeSettingToken;
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
      };
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeSettingTokenColor {
      /** 进度条颜色，未设置时使用主色 */
      nprogress?: string;
      container: string;
      layout: string;
      inverted: string;
      'base-text': string;
    }

    interface ThemeSettingTokenBoxShadow {
      header: string;
      sider: string;
      tab: string;
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor;
      boxShadow: ThemeSettingTokenBoxShadow;
    }

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    /** 主题 token CSS 变量 */
    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string };
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
    };
  }

  /** 全局命名空间 */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** 路由跳转参数 */
    type RouterPushOptions = {
      query?: Record<string, string>;
      params?: Record<string, string>;
    };

    /** 全局头部属性 */
    interface HeaderProps {
      /** 是否显示 logo */
      showLogo?: boolean;
      /** 是否显示菜单切换按钮 */
      showMenuToggler?: boolean;
      /** 是否显示菜单 */
      showMenu?: boolean;
    }

    /** 全局菜单 */
    type Menu = {
      /**
       * 菜单 key
       *
       * 等同于路由 key
       */
      key: string;
      /** 菜单名称 */
      label: string;
      /** 菜单 i18n key */
      i18nKey?: I18n.I18nKey | null;
      /** 路由 key */
      routeKey: RouteKey;
      /** 路由 path */
      routePath: RoutePath;
      /** 菜单图标 */
      icon?: () => VNode;
      /** 子菜单 */
      children?: Menu[];
    };

    type Breadcrumb = Omit<Menu, 'children'> & {
      options?: Breadcrumb[];
    };

    /** 标签页路由 */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** 全局标签页 */
    type Tab = {
      /** 标签页 id */
      id: string;
      /** 标签页名称 */
      label: string;
      /**
       * 新标签页名称
       *
       * 设置后标签页名称会被替换为该值
       */
      newLabel?: string;
      /**
       * 旧标签页名称
       *
       * 重置标签页名称时会被替换为该值
       */
      oldLabel?: string;
      /** 标签页路由 key */
      routeKey: LastLevelRouteKey;
      /** 标签页路由 path */
      routePath: RouteMap[LastLevelRouteKey];
      /** 标签页完整路径 */
      fullPath: string;
      /** 固定标签页索引 */
      fixedIndex?: number | null;
      /**
       * 标签页图标
       *
       * Iconify 图标
       */
      icon?: string;
      /**
       * 标签页本地图标
       *
       * 本地图标
       */
      localIcon?: string;
      /** I18n key */
      i18nKey?: I18n.I18nKey | null;
    };

    /** 表单校验规则 */
    type FormRule = import('naive-ui').FormItemRule;

    /** 全局下拉菜单 key */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * I18n 命名空间
   *
   * 多语言类型
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en-US' | 'zh-CN';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
    };

    type Schema = {
      system: {
        title: string;
        updateTitle: string;
        updateContent: string;
        updateConfirm: string;
        updateCancel: string;
      };
      common: {
        action: string;
        add: string;
        addSuccess: string;
        backToHome: string;
        batchDelete: string;
        cancel: string;
        close: string;
        check: string;
        expandColumn: string;
        columnSetting: string;
        config: string;
        confirm: string;
        delete: string;
        deleteSuccess: string;
        confirmDelete: string;
        edit: string;
        warning: string;
        error: string;
        index: string;
        keywordSearch: string;
        logout: string;
        logoutConfirm: string;
        lookForward: string;
        modify: string;
        modifySuccess: string;
        noData: string;
        operate: string;
        pleaseCheckValue: string;
        refresh: string;
        reset: string;
        search: string;
        switch: string;
        tip: string;
        trigger: string;
        update: string;
        updateSuccess: string;
        userCenter: string;
        yesOrNo: {
          yes: string;
          no: string;
        };
      };
      request: {
        logout: string;
        logoutMsg: string;
        logoutWithModal: string;
        logoutWithModalMsg: string;
        refreshToken: string;
        tokenExpired: string;
      };
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        grayscale: string;
        colourWeakness: string;
        layoutMode: { title: string; reverseHorizontalMix: string } & Record<UnionKey.ThemeLayoutMode, string>;
        recommendColor: string;
        recommendColorDesc: string;
        themeColor: {
          title: string;
          followPrimary: string;
        } & Theme.ThemeColor;
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        page: {
          animate: string;
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        fixedHeaderAndTab: string;
        header: {
          height: string;
          breadcrumb: {
            visible: string;
            showIcon: string;
          };
          multilingual: {
            visible: string;
          };
          globalSearch: {
            visible: string;
          };
        };
        tab: {
          visible: string;
          cache: string;
          height: string;
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        sider: {
          inverted: string;
          width: string;
          collapsedWidth: string;
          mixWidth: string;
          mixCollapsedWidth: string;
          mixChildMenuWidth: string;
        };
        footer: {
          visible: string;
          fixed: string;
          height: string;
          right: string;
        };
        watermark: {
          visible: string;
          text: string;
          enableUserName: string;
        };
        themeDrawerTitle: string;
        pageFunTitle: string;
        resetCacheStrategy: { title: string } & Record<UnionKey.ResetCacheStrategy, string>;
        configOperation: {
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: Record<I18nRouteKey, string>;
      page: {
        login: {
          common: {
            loginOrRegister: string;
            userNamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            reGetCode: string;
            sendCodeSuccess: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
          bindWeChat: {
            title: string;
          };
        };
        home: {
          branchDesc: string;
          greeting: string;
          weatherDesc: string;
          projectCount: string;
          todo: string;
          message: string;
          downloadCount: string;
          registerCount: string;
          schedule: string;
          study: string;
          work: string;
          rest: string;
          entertainment: string;
          visitCount: string;
          turnover: string;
          dealCount: string;
          projectNews: {
            title: string;
            moreNews: string;
            desc1: string;
            desc2: string;
            desc3: string;
            desc4: string;
            desc5: string;
          };
          creativity: string;
        };
      };
      form: {
        required: string;
        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        confirmPwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;
      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
      datatable: {
        itemCount: string;
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }

  /** 服务命名空间 */
  namespace Service {
    /** 其他 baseURL key */
    type OtherBaseURLKey = 'demo';

    interface ServiceConfigItem {
      /** 后端服务基础地址 */
      baseURL: string;
      /** 后端服务基础地址的代理前缀 */
      proxyPattern: string;
    }

    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    /** 后端服务配置 */
    interface ServiceConfig extends ServiceConfigItem {
      /** 其他后端服务配置 */
      other: OtherServiceConfigItem[];
    }

    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>;
    }

    /** 后端服务响应数据 */
    type Response<T = unknown> = {
      /** 响应码 */
      code: string;
      /** 响应信息 */
      msg: string;
      /** 响应数据 */
      data: T;
    };

    /** demo 后端服务响应数据 */
    type DemoResponse<T = unknown> = {
      /** 响应码 */
      status: string;
      /** 响应信息 */
      message: string;
      /** 响应数据 */
      result: T;
    };
  }
}
