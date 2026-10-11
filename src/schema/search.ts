import { description, object, picklist, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import {
  MANAGE_API_METHODS,
  MANAGE_ENABLED_VALUES,
  MANAGE_MENU_TYPES,
  MANAGE_RESOURCE_TYPES
} from '@/constants/manage';

/**
 * 管理端**搜索表单** schema（P3-03）。
 *
 * 与 `src/schema/form.ts`（operate 表单）分开：搜索表单的每个字段都是可清空的
 * 字符串，选中类字段额外把**空串**作为「全部」选项的值 —— 空串由
 * `filterValidQuery` 在发请求前剔除，后端永远收不到它。
 *
 * 与 `form.ts` 同约束：`useForm`（`@vean/ui`）走
 * `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，
 * `v.optional(v.string())`（无默认值）会让推导退化成 `never[]`，因此这里
 * 所有字段都**必须有默认值**（`v.string()` / 带空串的 `picklist`）。
 *
 * 值域刻意取自 `@/constants/manage`（不引 `./shared`）：后者会连带把 drizzle
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
const searchText = (label: string) => pipe(string(), description(`${label}，模糊匹配`));

/* -------------------------------------------------------------------------- */
/*                                  各域搜索                                   */
/* -------------------------------------------------------------------------- */

export const apiSearchFormSchema = object({
  name: searchText('接口名称'),
  path: searchText('接口路径'),
  method: apiMethodSearchSchema
});

export const userSearchFormSchema = object({
  username: searchText('用户名'),
  phone: searchText('手机号'),
  email: searchText('邮箱'),
  fullName: searchText('姓名'),
  enabled: enabledSearchSchema
});

export const roleSearchFormSchema = object({
  name: searchText('角色名称'),
  code: searchText('角色编码'),
  enabled: enabledSearchSchema
});

export const menuSearchFormSchema = object({
  name: searchText('菜单名称'),
  code: searchText('菜单编码'),
  menuType: menuTypeSearchSchema,
  enabled: enabledSearchSchema
});

export const permissionSearchFormSchema = object({
  name: searchText('权限名称'),
  code: searchText('权限编码'),
  resourceType: resourceTypeSearchSchema,
  enabled: enabledSearchSchema
});

export const orgSearchFormSchema = object({
  name: searchText('组织名称'),
  code: searchText('组织编码')
});

export const dictSearchFormSchema = object({
  name: searchText('字典名称'),
  code: searchText('字典编码'),
  isSystem: yesOrNoSearchSchema
});

export const dictItemSearchFormSchema = object({
  dictId: searchText('所属字典 ID'),
  label: searchText('字典项名称'),
  value: searchText('字典项值')
});

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type ApiSearchFormDTO = InferOutput<typeof apiSearchFormSchema>;
export type UserSearchFormDTO = InferOutput<typeof userSearchFormSchema>;
export type RoleSearchFormDTO = InferOutput<typeof roleSearchFormSchema>;
export type MenuSearchFormDTO = InferOutput<typeof menuSearchFormSchema>;
export type PermissionSearchFormDTO = InferOutput<typeof permissionSearchFormSchema>;
export type OrgSearchFormDTO = InferOutput<typeof orgSearchFormSchema>;
export type DictSearchFormDTO = InferOutput<typeof dictSearchFormSchema>;
export type DictItemSearchFormDTO = InferOutput<typeof dictItemSearchFormSchema>;
