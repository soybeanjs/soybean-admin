declare namespace StorageInterface {
  /** localStorage的存储数据的类型 */
  interface Session {
    demoKey: string;
  }

  /** localStorage的存储数据的类型 */
  interface Local {
    /** 主题颜色 */
    themeColor: string;
    /** 用户token */
    token: string;
    /** 用户刷新token */
    refreshToken: string;
    /** 用户信息 */
    userInfo: Auth.UserInfo;
    /** 主题配置 */
    themeSettings: Theme.Setting;
    /** 多页签路由信息 */
    multiTabRoutes: App.GlobalTabRoute[];
  }
}
