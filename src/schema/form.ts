import * as v from 'valibot';
import { apiMethodSchema, enabledSchema, idSchema, menuTypeSchema } from './shared';

/**
 * 管理端**表单** schema（P3-03）。
 *
 * 为什么不直接用 `*.createSchema` / `*.updateSchema`：`useForm`（`@vean/ui`）
 * 通过 `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，而
 * `v.optional(v.string())`（不含默认值，如 `userUpdateSchema.password`）会把该
 * 字段推成 `string | undefined`，TanStack 的 `DeepKeys<unknown>` 退化为
 * `never[]` —— `SFormField` 的 `name` 与插槽类型随即整体失效。所以表单只接
 * **每个键都有值**的 schema。
 *
 * 与各域 create schema 的关系：字段名与类型"宽兼容"——凡是 create schema 里
 * 已有的键，这里复用**同一个 schema 对象**（`apiMethodSchema` / `enabledSchema`
 * / `descriptionSchema` …），保证值域不会两份漂移；只在 create schema 缺失
 * （如用户的 `enabled`、菜单的 `enabled`）或需要"空串 = 不改"语义（用户的
 * `password`）时另加字段。
 *
 * 提交时由页面把表单值裁剪成 DTO（例：新增用户不带 `enabled`，编辑用户留空
 * 密码就不提交 `password`）。`src/schema/form.test.ts` 断言两者键集合兼容。
 */

const requiredText = v.pipe(v.string(), v.nonEmpty());

/**
 * 「可为空文本」字段。
 *
 * **不用 `src/schema/shared.ts` 的 `descriptionSchema`**：它是
 * `v.optional(v.nullable(v.string()), null)`，输入类型含 `undefined`，而
 * `useForm` 的 `onSubmit` 回调收到的是 `InferStandardSchemaInput`（输入类型）——
 * 拿它去构造 DTO（输出类型）会报 `string | null | undefined` 不可赋值给
 * `string | null`。表单里该字段总有一个确定值（空串或字符串），故这里用
 * `v.nullable(v.string())`：值域与 DTO 一致，且不引入 `undefined`。
 */
const nullableText = v.nullable(v.string());

/* -------------------------------------------------------------------------- */
/*                                    用户                                     */
/* -------------------------------------------------------------------------- */

/**
 * 用户 operate 表单。
 *
 * `password` 用「空串 = 不改」语义：新增时必填（服务端 `userCreateSchema`
 * 强制），编辑时留空即从提交载荷里剔除。**不在 schema 层做条件必填** ——
 * 跨字段 refine 的 issue 无字段路径，会落到 `_form` 键，弹窗里没地方渲染。
 */
export const userFormSchema = v.object({
  username: requiredText,
  password: v.string(),
  fullName: v.string(),
  phone: v.string(),
  email: v.string(),
  homePath: v.string(),
  enabled: enabledSchema,
  roleIds: v.array(idSchema)
});

/* -------------------------------------------------------------------------- */
/*                                    角色                                     */
/* -------------------------------------------------------------------------- */

export const roleFormSchema = v.object({
  name: requiredText,
  code: requiredText,
  description: nullableText,
  enabled: enabledSchema,
  permissionIds: v.array(idSchema)
});

/* -------------------------------------------------------------------------- */
/*                                    接口                                     */
/* -------------------------------------------------------------------------- */

export const apiFormSchema = v.object({
  name: requiredText,
  path: requiredText,
  method: apiMethodSchema,
  description: nullableText
});

/* -------------------------------------------------------------------------- */
/*                                    组织                                     */
/* -------------------------------------------------------------------------- */

export const orgFormSchema = v.object({
  parentId: v.nullable(idSchema),
  name: requiredText,
  code: requiredText,
  description: nullableText
});

/* -------------------------------------------------------------------------- */
/*                                    字典                                     */
/* -------------------------------------------------------------------------- */

export const dictFormSchema = v.object({
  name: requiredText,
  code: requiredText,
  isSystem: v.picklist(['Y', 'N']),
  description: nullableText
});

export const dictItemFormSchema = v.object({
  dictId: requiredText,
  parentId: v.nullable(idSchema),
  label: requiredText,
  value: requiredText,
  order: v.number()
});

/* -------------------------------------------------------------------------- */
/*                                    权限                                     */
/* -------------------------------------------------------------------------- */

/**
 * 权限 operate 表单。
 *
 * `name` / `code` 只有 `resourceType === 'other'` 时才是权威值；绑定
 * `menu` / `api` / `button` 资源时由服务端（`resolveResourceBinding`）推导，
 * 客户端传空串即可（服务端 create schema 里两者也是 optional）。
 */
export const permissionFormSchema = v.object({
  name: v.string(),
  code: v.string(),
  resourceType: v.picklist(['menu', 'api', 'button', 'other']),
  resourceId: v.nullable(idSchema),
  enabled: enabledSchema,
  description: nullableText
});

/* -------------------------------------------------------------------------- */
/*                                    菜单                                     */
/* -------------------------------------------------------------------------- */

export const menuFormSchema = v.object({
  parentId: v.nullable(idSchema),
  menuType: menuTypeSchema,
  name: requiredText,
  code: requiredText,
  requiresAuth: v.picklist(['Y', 'N']),
  enabled: enabledSchema,
  icon: v.string(),
  i18nKey: v.string(),
  order: v.number(),
  iframeUrl: v.string(),
  href: v.string(),
  keepAlive: v.picklist(['Y', 'N']),
  multiTab: v.picklist(['Y', 'N']),
  pinned: v.picklist(['Y', 'N']),
  routeName: v.string(),
  routePath: v.string(),
  routeLayout: v.string(),
  routeComponent: v.string(),
  routeRedirect: v.string(),
  routeQueries: v.record(v.string(), v.string()),
  routeParams: v.record(v.string(), v.string()),
  description: nullableText
});

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type UserFormDTO = v.InferOutput<typeof userFormSchema>;
export type RoleFormDTO = v.InferOutput<typeof roleFormSchema>;
export type ApiFormDTO = v.InferOutput<typeof apiFormSchema>;
export type OrgFormDTO = v.InferOutput<typeof orgFormSchema>;
export type DictFormDTO = v.InferOutput<typeof dictFormSchema>;
export type DictItemFormDTO = v.InferOutput<typeof dictItemFormSchema>;
export type PermissionFormDTO = v.InferOutput<typeof permissionFormSchema>;
export type MenuFormDTO = v.InferOutput<typeof menuFormSchema>;

/** 8 套 operate 表单的 schema 清单（`src/schema/form.test.ts` 用） */
export const MANAGE_FORM_SCHEMAS = {
  user: userFormSchema,
  role: roleFormSchema,
  api: apiFormSchema,
  org: orgFormSchema,
  dict: dictFormSchema,
  dictItem: dictItemFormSchema,
  permission: permissionFormSchema,
  menu: menuFormSchema
} as const;
