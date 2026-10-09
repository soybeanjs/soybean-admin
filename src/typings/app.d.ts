/**
 * 客户端 API 契约类型（与后端 DTO 手工对齐，v3 §6.3）。
 *
 * `.ubean/openapi.d.ts` 的 200 响应未携带 content schema（describeRoute 未接
 * 响应 schema），typed client 无法推断响应体 —— 这里按服务端
 * `src/schema/auth.ts` / `src/db/schema/menu.ts` 手工镜像，服务端改动需同步。
 */

/** 用户安全视图（镜像后端 `AuthUserDTO`，绝不含 password） */
export interface ApiUserInfo {
  id: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  email: string | null;
  phone: string | null;
  homePath: string | null;
  description: string | null;
  enabled: 'Y' | 'N' | 'D';
  /** 角色码列表（粗粒度：路由/菜单级判定） */
  roles: string[];
  /** 按钮级权限码列表（P3-06；`hasAuth(code)` / `v-auth` 判定） */
  buttons: string[];
}

/** 登录 / 刷新令牌响应（镜像后端 `LoginResult`） */
export interface ApiLoginResult {
  token: string;
  refreshToken: string;
  user: ApiUserInfo;
}

/** 图形验证码（镜像后端 `captcha.service.ts` 的 `CaptchaResult`） */
export interface ApiCaptcha {
  /** 验证码标识（提交时回传） */
  captchaId: string;
  /** SVG 图片的 data URL，可直接用作 `<img :src>` */
  img: string;
}

/** 微信绑定二维码（镜像后端 `WechatQrcodeResult`，mock） */
export interface ApiWechatQrcode {
  /** 二维码票据（POST /api/auth/bind-wechat 提交） */
  ticket: string;
  /** 形似官方 qrconnect 的授权地址（仅展示） */
  url: string;
  /** 有效期（秒） */
  expiresIn: number;
}

/** 微信绑定状态（镜像后端 `WechatBindingResult`） */
export interface ApiWechatBinding {
  bound: boolean;
  /** 绑定后的假昵称（未绑定时为 null） */
  nickname: string | null;
}

/** 菜单类型（镜像后端 `MENU_TYPES`） */
export type ApiMenuType = 'directory' | 'menu' | 'page' | 'iframe' | 'link' | 'button' | 'other';

/** 菜单行（`GET /api/menu/user` 返回，镜像后端 menu 表列的客户端子集） */
export interface ApiMenuRow {
  id: string;
  parentId: string | null;
  name: string;
  code: string;
  menuType: ApiMenuType;
  requiresAuth: 'Y' | 'N';
  icon: string | null;
  i18nKey: string | null;
  order: number;
  iframeUrl: string | null;
  href: string | null;
  routePath: string | null;
  routeName: string | null;
  routeLayout: string | null;
  routeComponent: string | null;
  routeRedirect: string | null;
  routeQueries: Record<string, string> | null;
  routeParams: Record<string, string> | null;
  keepAlive: 'Y' | 'N' | null;
  multiTab: 'Y' | 'N' | null;
  pinned: 'Y' | 'N' | null;
  description: string | null;
}

/** SAppShell 菜单项（`AppShellMenuItem` 的应用侧形态） */
export interface MenuTreeNode {
  /** 唯一键 = 路由名（目录为菜单 code） */
  value: string;
  /** 原始文案（i18nKey 缺失时的兑底；展示层用 `t(i18nKey) || label` 解析） */
  label: string;
  /** 菜单标题 i18n key（标题单一来源） */
  i18nKey?: string;
  icon?: string;
  /** 可导航路径（叶子节点才有；选中菜单时按 path 跳转，规避动态路由名不在
   * RouteNamedMap 字面量并集里的类型问题） */
  path?: string;
  /**
   * 外链（menuType `link`）：新窗口打开；与 `path` 互斥（P3-07）。
   * 布局的 `onMenuSelect` 优先看它。
   */
  href?: string;
  /**
   * 内嵌外链（menuType `iframe`）：值即 iframe 地址，点击时拼 `/?url=` 跳转。
   * 与 `path` 互斥（P3-07）。
   */
  iframeUrl?: string;
  /** 子节点（多级菜单；静态模式由 `meta.menuParent` 建树，dynamic 模式来自菜单表 parentId） */
  children?: MenuTreeNode[];
}

/** 页签（`PageTabsOptionData` 的应用侧扩展形态） */
export interface AppTab {
  /** 唯一键：multiTab 页 = fullPath，普通页 = 路由名 */
  value: string;
  /** 原始文案（i18nKey 缺失时的兑底；展示层用 `t(i18nKey) || label` 解析） */
  label: string;
  /** 页签标题 i18n key（标题单一来源） */
  i18nKey?: string;
  icon?: string;
  pinned?: boolean;
  /** 归属路由名（keep-alive 驱逐 / 关页跳转用） */
  routeName: string;
  /** 路由完整路径（点击页签跳转用） */
  fullPath: string;
}

/**
 * 路由 meta 扩展（文件路由 `definePage({ meta })` + 动态路由共用）。
 *
 * 用 type alias 而非 interface：vue-router 的 `RouteMeta` 继承了
 * `Record<PropertyKey, unknown>`，interface 没有隐式索引签名，赋给 RouteMeta
 * 会因缺索引签名而不可赋值；object type alias 有隐式索引签名，双向兼容。
 */
export type AppRouteMeta = {
  /** 页面标题（静态页兜底；dynamic 下以菜单 i18nKey 为单一来源） */
  title?: string;
  /** 菜单 i18n key（标题单一来源） */
  i18nKey?: string;
  /** 菜单图标 */
  icon?: string;
  /** 菜单排序 */
  order?: number;
  /** 是否隐藏在菜单中 */
  hideInMenu?: boolean;
  /**
   * 需要拥有的角色码（任一命中即可）；静态路由不配则视为公开。
   *
   * 路由级判定在 `src/router/guard.ts`：不命中 → `403` 页（P3-06）。
   * 仅作粗粒度门禁，细粒度按钮权限走 `v-auth` / `hasAuth`。
   */
  roles?: string[];
  /**
   * 激活的高亮菜单值（子页不在菜单时指向父菜单，隐藏子菜单演示用）。
   *
   * `src/layouts/default.vue` 把它喂给 `SAppShell` 的 `model-value`。
   * 静态菜单的建树也用它兜底：声明了 `activeMenu` 的隐藏子页会挂到该父节点下。
   */
  activeMenu?: string;
  /**
   * 静态菜单树的父节点值（父路由的路由名）。
   *
   * 文件式路由不产生嵌套关系（每个页面都是一条平级记录），多级菜单演示
   * （`/multi-menu/**`）靠这个字段显式声明层级；不配则是一级菜单。
   * 建树在 `src/store/modules/menu/index.ts` 的 `buildStaticMenuTree()`。
   */
  menuParent?: string;
  /** keep-alive 缓存（ubean `meta.cache`：PageView 据此种入 KeepAlive；dynamic 模式由菜单表下发） */
  cache?: boolean;
  /** multiTab：同路由不同 query 独立页签 */
  multiTab?: boolean;
  /** 页签固定 */
  pinned?: boolean;
  /**
   * 外链地址（`menuType === 'link'`）：点击菜单以新窗口打开，不产生路由。
   *
   * `src/layouts/default.vue` 的 `onMenuSelect` 在跳路由前先看它（P3-07）。
   */
  href?: string;
  /**
   * 内嵌外链地址（`menuType === 'iframe'`）：点击菜单跳 `/?url=<编码后的地址>`。
   *
   * 动态菜单下发；`/iframe` 页读 query 后做 http(s) 协议白名单（P3-07）。
   */
  iframeUrl?: string;
  /** 动态路由来源的菜单 id（一致性断言用） */
  menuId?: string;
  /** 挂载布局（dynamic 模式 routeLayout 下发） */
  layout?: string;
};
