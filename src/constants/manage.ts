/**
 * 管理端常量（P3-03）。
 *
 * 刻意**不**从 `@/db/schema/shared`（drizzle）或 `@/schema/shared`（valibot）
 * 取值：那两份会分别把 drizzle-core / valibot 拉进客户端产物。这里的值域是
 * 稳定的字符串契约，`src/constants/manage.test.ts` 断言它们与 schema 一致，
 * 用一条测试换掉一份运行时依赖。
 *
 * 标签**不在这里**：文案必须以静态字面量 key 的 `t()` 调用形式写在组件/组合式
 * 函数里，才能被 `scripts/remove-i18n` 内联（`test/remove-i18n.test.ts` 断言
 * `plan.leftovers === []`）。把 key 存进常量表再用 `t(table[key])` 取值会留下
 * 无法裁剪的 `useI18n` 装配，因此常量层只保留**值域**与**语义色**。
 */

/** enabled 列值域（与 `src/schema/shared.ts` 的 `ENABLED_VALUES` 一致） */
export const MANAGE_ENABLED_VALUES = ['Y', 'N', 'D'] as const;

/** 是/否值域（requiresAuth / keepAlive / multiTab / pinned / isSystem） */
export const MANAGE_YES_OR_NO_VALUES = ['Y', 'N'] as const;

/** 菜单类型值域（与 `MENU_TYPES` 一致） */
export const MANAGE_MENU_TYPES = ['directory', 'menu', 'page', 'iframe', 'link', 'button', 'other'] as const;

/** HTTP 方法值域（与 `API_METHODS` 一致，展示时大写） */
export const MANAGE_API_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;

/** 权限资源类型值域（与 `src/schema/permission.ts` 的 picklist 一致） */
export const MANAGE_RESOURCE_TYPES = ['menu', 'api', 'button', 'other'] as const;

/** enabled tag 的语义色（`@vean/ui` 的 `ThemeColor`） */
export const ENABLED_TAG_COLORS = {
  Y: 'success',
  N: 'warning',
  D: 'destructive'
} as const;

/**
 * 菜单类型 → 允许的子菜单类型（父级选择器过滤用，与后端
 * `src/services/menu.service.ts` 的 `validateParent` 约束一致）。
 */
export const MENU_CHILD_TYPES = {
  directory: ['directory', 'menu', 'page', 'iframe', 'link', 'button', 'other'],
  menu: ['page', 'button', 'other'],
  page: ['button', 'other'],
  iframe: ['button', 'other'],
  link: ['button', 'other'],
  button: [],
  other: []
} as const;

/** 需要路由字段（routeName/routePath/…）的菜单类型 */
export const MENU_ROUTE_TYPES = ['menu', 'page', 'iframe'] as const;

/** 忽略 `enabled` 语义的菜单类型（按钮/权限点不参与顶部菜单渲染） */
export const MENU_IGNORED_ROUTE_TYPES = ['button', 'other'] as const;

/* -------------------------------------------------------------------------- */
/*                                   类型导出                                   */
/* -------------------------------------------------------------------------- */

/** 启用状态值 */
export type ManageEnabledValue = (typeof MANAGE_ENABLED_VALUES)[number];
/** 是/否值 */
export type ManageYesOrNoValue = (typeof MANAGE_YES_OR_NO_VALUES)[number];
/** 菜单类型值 */
export type ManageMenuType = (typeof MANAGE_MENU_TYPES)[number];
/** HTTP 方法值 */
export type ManageApiMethod = (typeof MANAGE_API_METHODS)[number];
/** 权限资源类型值 */
export type ManageResourceType = (typeof MANAGE_RESOURCE_TYPES)[number];
