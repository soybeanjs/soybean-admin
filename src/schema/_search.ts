import { description, picklist, pipe, string } from 'valibot';
import {
  MANAGE_API_METHODS,
  MANAGE_ENABLED_VALUES,
  MANAGE_MENU_TYPES,
  MANAGE_RESOURCE_TYPES
} from '@/constants/manage';

/**
 * 搜索表单的**跨域公共片段**（P3-03）。
 *
 * 与 operate 表单同约束：`useForm`（`@vean/ui`）走 `@tanstack/form-core` 的
 * `DeepKeys<Values>` 推导字段名，`v.optional(v.string())`（无默认值）会让推导
 * 退化成 `never[]`，因此搜索字段一律**带默认值**（`v.string()` / 带空串的
 * `picklist`）。每个域自己的搜索表单 schema 放在各自的域文件里，这里只留
 * 真正被多处复用的枚举值域与文本字段工厂。
 *
 * 值域刻意取自 `@/constants/manage`（不引 `./_shared`）：后者会连带把 drizzle
 * 拉进客户端产物。
 */

/** 「全部」选项的值：空串，发请求前被 `filterValidQuery` 剔除 */
export const SEARCH_ANY_VALUE = '';

/** 带「全部」选项的枚举搜索字段（空串 = 全部） */
const searchableEnum = (values: readonly [string, ...string[]], label: string) =>
  pipe(picklist([SEARCH_ANY_VALUE, ...values]), description(`${label}（空串为全部）`));

/** enabled 搜索值域（`''` = 全部） */
export const enabledSearchSchema = searchableEnum(MANAGE_ENABLED_VALUES, '状态');

/** 是/否搜索值域（`''` = 全部） */
export const yesOrNoSearchSchema = searchableEnum(['Y', 'N'] as const, '是否');

/** 菜单类型搜索值域（`''` = 全部） */
export const menuTypeSearchSchema = searchableEnum(MANAGE_MENU_TYPES, '菜单类型');

/** 权限资源类型搜索值域（`''` = 全部） */
export const resourceTypeSearchSchema = searchableEnum(MANAGE_RESOURCE_TYPES, '资源类型');

/** API 方法搜索值域（`''` = 全部） */
export const apiMethodSearchSchema = searchableEnum(MANAGE_API_METHODS, 'HTTP 方法');

/** 搜索表单字段：可清空文本 */
export const searchText = (label: string) => pipe(string(), description(`${label}，模糊匹配`));
