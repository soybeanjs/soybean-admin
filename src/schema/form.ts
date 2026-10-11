import { array, description, nonEmpty, nullable, number, object, picklist, pipe, record, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { apiMethodSchema, enabledSchema, idSchema, menuTypeSchema, resourceTypeSchema, yesOrNoSchema } from './shared';

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
 * / `menuTypeSchema` …），保证值域不会两份漂移；只在 create schema 缺失
 * （如用户的 `enabled`）或需要"空串 = 不改"语义（用户的 `password`）时另加字段。
 *
 * 提交时由页面把表单值裁剪成 DTO（例：新增用户不带 `enabled`，编辑用户留空
 * 密码就不提交 `password`）。`test/specs/schema/form.test.ts` 断言两者键集合兼容。
 */

/** 必填文本字段 */
const requiredText = (label: string) => pipe(string(), nonEmpty(`${label}不能为空`), description(label));

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
const nullableText = (label: string) => nullable(pipe(string(), description(label)));

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
export const userFormSchema = object({
  username: requiredText('用户名'),
  password: pipe(string(), description('登录密码，编辑时留空表示不改')),
  fullName: pipe(string(), description('姓名')),
  phone: pipe(string(), description('手机号')),
  email: pipe(string(), description('邮箱')),
  homePath: pipe(string(), description('登录后跳转的首页路径')),
  enabled: enabledSchema,
  roleIds: pipe(array(idSchema), description('绑定的角色 ID 列表'))
});

/* -------------------------------------------------------------------------- */
/*                                    角色                                     */
/* -------------------------------------------------------------------------- */

export const roleFormSchema = object({
  name: requiredText('角色名称'),
  code: requiredText('角色编码'),
  description: nullableText('备注说明'),
  enabled: enabledSchema,
  permissionIds: pipe(array(idSchema), description('绑定的权限 ID 列表'))
});

/* -------------------------------------------------------------------------- */
/*                                    接口                                     */
/* -------------------------------------------------------------------------- */

export const apiFormSchema = object({
  name: requiredText('接口名称'),
  path: requiredText('接口路径'),
  method: apiMethodSchema,
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                                    组织                                     */
/* -------------------------------------------------------------------------- */

export const orgFormSchema = object({
  parentId: nullable(idSchema),
  name: requiredText('组织名称'),
  code: requiredText('组织编码'),
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                                    字典                                     */
/* -------------------------------------------------------------------------- */

export const dictFormSchema = object({
  name: requiredText('字典名称'),
  code: requiredText('字典编码'),
  isSystem: pipe(picklist(['Y', 'N']), description('是否系统内置字典')),
  description: nullableText('备注说明')
});

export const dictItemFormSchema = object({
  dictId: requiredText('所属字典 ID'),
  parentId: nullable(idSchema),
  label: requiredText('字典项名称'),
  value: requiredText('字典项值'),
  order: pipe(number(), description('排序值，数字越小越靠前'))
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
export const permissionFormSchema = object({
  name: pipe(string(), description('权限名称，绑定资源时留空')),
  code: pipe(string(), description('权限编码，绑定资源时留空')),
  resourceType: resourceTypeSchema,
  resourceId: nullable(idSchema),
  enabled: enabledSchema,
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                                    菜单                                     */
/* -------------------------------------------------------------------------- */

export const menuFormSchema = object({
  parentId: nullable(idSchema),
  menuType: menuTypeSchema,
  name: requiredText('菜单名称'),
  code: requiredText('菜单编码'),
  requiresAuth: yesOrNoSchema,
  enabled: enabledSchema,
  icon: pipe(string(), description('图标名')),
  i18nKey: pipe(string(), description('i18n 文案 key')),
  order: pipe(number(), description('排序值，数字越小越靠前')),
  iframeUrl: pipe(string(), description('iframe 内嵌地址')),
  href: pipe(string(), description('外链地址')),
  keepAlive: yesOrNoSchema,
  multiTab: yesOrNoSchema,
  pinned: yesOrNoSchema,
  routeName: pipe(string(), description('路由名称')),
  routePath: pipe(string(), description('路由路径')),
  routeLayout: pipe(string(), description('布局组件标识')),
  routeComponent: pipe(string(), description('页面组件路径')),
  routeRedirect: pipe(string(), description('重定向目标路径')),
  routeQueries: pipe(record(string(), string()), description('固定 query 参数')),
  routeParams: pipe(record(string(), string()), description('固定 route 参数')),
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type UserFormDTO = InferOutput<typeof userFormSchema>;
export type RoleFormDTO = InferOutput<typeof roleFormSchema>;
export type ApiFormDTO = InferOutput<typeof apiFormSchema>;
export type OrgFormDTO = InferOutput<typeof orgFormSchema>;
export type DictFormDTO = InferOutput<typeof dictFormSchema>;
export type DictItemFormDTO = InferOutput<typeof dictItemFormSchema>;
export type PermissionFormDTO = InferOutput<typeof permissionFormSchema>;
export type MenuFormDTO = InferOutput<typeof menuFormSchema>;

/** 8 套 operate 表单的 schema 清单（`test/specs/schema/form.test.ts` 用） */
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
