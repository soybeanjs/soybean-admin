import * as v from 'valibot';
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
 */

/** 「全部」选项的值：空串，发请求前被 `filterValidQuery` 剔除 */
export const SEARCH_ANY_VALUE = '';

/** enabled 搜索值域（`''` = 全部） */
export const enabledSearchSchema = v.picklist([SEARCH_ANY_VALUE, ...MANAGE_ENABLED_VALUES]);

/** 是/否搜索值域（`''` = 全部） */
export const yesOrNoSearchSchema = v.picklist([SEARCH_ANY_VALUE, 'Y', 'N']);

/** 菜单类型搜索值域（`''` = 全部） */
export const menuTypeSearchSchema = v.picklist([SEARCH_ANY_VALUE, ...MANAGE_MENU_TYPES]);

/** 权限资源类型搜索值域（`''` = 全部） */
export const resourceTypeSearchSchema = v.picklist([SEARCH_ANY_VALUE, ...MANAGE_RESOURCE_TYPES]);

/** API 方法搜索值域（`''` = 全部） */
export const apiMethodSearchSchema = v.picklist([SEARCH_ANY_VALUE, ...MANAGE_API_METHODS]);

/* -------------------------------------------------------------------------- */
/*                                  各域搜索                                   */
/* -------------------------------------------------------------------------- */

export const apiSearchFormSchema = v.object({
  name: v.string(),
  path: v.string(),
  method: apiMethodSearchSchema
});

export const userSearchFormSchema = v.object({
  username: v.string(),
  phone: v.string(),
  email: v.string(),
  fullName: v.string(),
  enabled: enabledSearchSchema
});

export const roleSearchFormSchema = v.object({
  name: v.string(),
  code: v.string(),
  enabled: enabledSearchSchema
});

export const menuSearchFormSchema = v.object({
  name: v.string(),
  code: v.string(),
  menuType: menuTypeSearchSchema,
  enabled: enabledSearchSchema
});

export const permissionSearchFormSchema = v.object({
  name: v.string(),
  code: v.string(),
  resourceType: resourceTypeSearchSchema,
  enabled: enabledSearchSchema
});

export const orgSearchFormSchema = v.object({
  name: v.string(),
  code: v.string()
});

export const dictSearchFormSchema = v.object({
  name: v.string(),
  code: v.string(),
  isSystem: yesOrNoSearchSchema
});

export const dictItemSearchFormSchema = v.object({
  dictId: v.string(),
  label: v.string(),
  value: v.string()
});

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type ApiSearchFormDTO = v.InferOutput<typeof apiSearchFormSchema>;
export type UserSearchFormDTO = v.InferOutput<typeof userSearchFormSchema>;
export type RoleSearchFormDTO = v.InferOutput<typeof roleSearchFormSchema>;
export type MenuSearchFormDTO = v.InferOutput<typeof menuSearchFormSchema>;
export type PermissionSearchFormDTO = v.InferOutput<typeof permissionSearchFormSchema>;
export type OrgSearchFormDTO = v.InferOutput<typeof orgSearchFormSchema>;
export type DictSearchFormDTO = v.InferOutput<typeof dictSearchFormSchema>;
export type DictItemSearchFormDTO = v.InferOutput<typeof dictItemSearchFormSchema>;
