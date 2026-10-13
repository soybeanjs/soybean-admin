/**
 * 纯 UI 契约类型（不含任何 API 形状）。
 *
 * API / DTO 类型的单一来源是 `src/schema/**`（valibot schema 推导），响应体由
 * `src/request` 的 typed client 从 `.ubean/openapi.d.ts` 推断 —— 这里只留 UI 层
 * 自己拆出来的视图类型（菜单项 / 页签 / 路由 meta）。
 *
 * 历史上这里手工镜像过 `ApiUserInfo` / `ApiLoginResult` / `ApiMenuRow` 等，
 * 已全部删掉：路由响应 schema 补齐后它们是冗余的第二来源。
 */

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
  /** 子节点（多级菜单；**统一来自菜单行的 `parentId`**，见 `buildMenuTree`） */
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
  /**
   * ubean keep-alive 的契约字段：`PageView` 用它决定是否给页面组件套一层
   * 以它为 `name` 的包装（`getNamedPageWrapper`），`<KeepAlive :include>` 匹配的
   * 就是这个包装名。静态页由生成器写入（`@ubean/vue` 的 `buildRouteMeta`）；
   * dynamic 路由由 `transformMenuToRoute` 手动补 —— 不补则 `cache` 静默失效。
   */
  pageName?: string;
  /**
   * 激活的高亮菜单值（子页不在菜单时指向父菜单，隐藏子菜单演示用）。
   *
   * 只影响侧栏高亮：`src/layouts/default.vue` 的 `activeMenuValue` 把它喂给
   * `SAppShell` 的 `model-value`。隐藏子页不进菜单（`hideInMenu`），所以没有
   * 「挂到父节点」的问题。
   */
  activeMenu?: string;
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
   * 静态菜单树的父节点值（父路由的路由名）。
   *
   * 文件式路由不产生嵌套关系（每个页面都是一条平级记录），多级菜单演示
   * （`/multi-menu/**`）靠这个字段显式声明层级；不配则是一级菜单。
   * **作为菜单源生成期的事实**：`scripts/menu-sync.ts` 把它转成菜单行的
   * `parentId`（`M_${snake(menuParent)}`）；运行时建树只看 `parentId`
   * （`src/store/modules/menu/shared.ts` 的 `buildMenuTree`）。
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
  /**
   * 是否需要登录（`false` = 公开页）。
   *
   * ⚠️ 必须写在 `definePage({ meta: { requiresAuth: false } })` 里，**不能**写成
   * `definePage` 的顶层字段。ubean 0.6.0 的生成器只发射顶层 `requiresAuth: true`
   * （`@ubean/vue/dist/generator.js` 的 `renderRouteRecord`：
   * `if (page.pageMeta?.requiresAuth === true)`），顶层 `false` 会被静默丢弃，
   * 于是 `to.meta.requiresAuth === false` 永假 → 未登录访问公开页被守卫无限
   * 重定向（真实浏览器里渲染进程 100% CPU 卡死）。`meta` 是逐字透传的
   * （`computeMeta()`），只有这条路径可靠。回归保护见 `test/specs/guards/page-meta-guard.test.ts`。
   */
  requiresAuth?: boolean;
  /** 动态路由来源的菜单 id（一致性断言用） */
  menuId?: string;
  /** 挂载布局（dynamic 模式 routeLayout 下发） */
  layout?: string;
};
