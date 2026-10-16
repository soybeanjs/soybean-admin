/** 纯 UI 契约类型（不含任何 API 形状） 详见 docs/v3-notes.md N-012。 */

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
  /** 外链（menuType `link`）：新窗口打开；与 `path` 互斥（P3-07） 详见 docs/v3-notes.md N-013。 */
  href?: string;
  /** 内嵌外链（menuType `iframe`）：值即 iframe 地址，点击时拼 `/?url=` 跳转 详见 docs/v3-notes.md N-014。 */
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

/** 路由 meta 扩展（文件路由 `definePage({ meta })` + 动态路由共用） 详见 docs/v3-notes.md N-015。 */
export type AppRouteMeta = {
  /** ubean keep-alive 的契约字段：`PageView` 用它决定是否给页面组件套一层 详见 docs/v3-notes.md N-016。 */
  pageName?: string;
  /** 激活的高亮菜单值（子页不在菜单时指向父菜单，隐藏子菜单演示用） 详见 docs/v3-notes.md N-017。 */
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
  /** 需要拥有的角色码（任一命中即可）；静态路由不配则视为公开 详见 docs/v3-notes.md N-018。 */
  roles?: string[];
  /** 静态菜单树的父节点值（父路由的路由名） 详见 docs/v3-notes.md N-019。 */
  menuParent?: string;
  /** keep-alive 缓存（ubean `meta.cache`：PageView 据此种入 KeepAlive；dynamic 模式由菜单表下发） */
  cache?: boolean;
  /** multiTab：同路由不同 query 独立页签 */
  multiTab?: boolean;
  /** 页签固定 */
  pinned?: boolean;
  /** 外链地址（`menuType === 'link'`）：点击菜单以新窗口打开，不产生路由 详见 docs/v3-notes.md N-020。 */
  href?: string;
  /** 内嵌外链地址（`menuType === 'iframe'`）：点击菜单跳 `/?url=<编码后的地址>` 详见 docs/v3-notes.md N-021。 */
  iframeUrl?: string;
  /** （`@ubean/vue/dist/generator.js` 的 `renderRouteRecord`：） 详见 docs/v3-notes.md N-022。 */
  requiresAuth?: boolean;
  /** 动态路由来源的菜单 id（一致性断言用） */
  menuId?: string;
  /** 挂载布局（dynamic 模式 routeLayout 下发） */
  layout?: string;
};
