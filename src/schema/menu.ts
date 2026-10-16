import {
  array,
  boolean,
  description,
  integer,
  intersect,
  lazy,
  metadata,
  nonEmpty,
  nullable,
  number,
  object,
  optional,
  partial,
  pipe,
  record,
  string
} from 'valibot';
import type { GenericSchema, InferOutput } from 'valibot';
import { nullableText, requiredText, text } from './_form';
import { enabledSearchSchema, menuTypeSearchSchema, searchText } from './_search';
import {
  auditFields,
  enabledSchema,
  idSchema,
  menuTypeSchema,
  orderSchema,
  pagedSchema,
  paginationQuerySchema,
  rowText,
  yesOrNoSchema
} from './_shared';

/**
 * 菜单契约（v3 §6.3，unify menu.service 范式）。
 * 路由字段抽成 `routeFields`：新增与更新共用一份值域，只有默认值与可选性不同。
 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 路由定义字段（新增语义：带默认值） */
const routeFields = {
  routeName: optional(nullable(pipe(string(), description('路由名称，需与页面 definePage 一致'))), null),
  routePath: optional(nullable(pipe(string(), description('路由路径'))), null),
  routeLayout: optional(nullable(pipe(string(), description('布局组件标识'))), null),
  routeComponent: optional(nullable(pipe(string(), description('页面组件路径'))), null),
  routeRedirect: optional(nullable(pipe(string(), description('重定向目标路径'))), null),
  routeQueries: optional(nullable(pipe(record(string(), string()), description('固定 query 参数'))), {}),
  routeParams: optional(nullable(pipe(record(string(), string()), description('固定 route 参数'))), {})
};

/** 新增菜单 */
export const menuCreateSchema = object({
  parentId: optional(nullable(idSchema), null),
  menuType: menuTypeSchema,
  name: pipe(string(), nonEmpty('菜单名称不能为空'), description('菜单名称')),
  code: pipe(string(), nonEmpty('菜单编码不能为空'), description('菜单编码，全局唯一')),
  requiresAuth: optional(yesOrNoSchema, 'Y'),
  icon: optional(nullable(pipe(string(), description('图标名'))), null),
  i18nKey: optional(nullable(pipe(string(), description('i18n 文案 key'))), null),
  order: orderSchema,
  iframeUrl: optional(nullable(pipe(string(), description('iframe 内嵌地址'))), null),
  href: optional(nullable(pipe(string(), description('外链地址'))), null),
  keepAlive: optional(yesOrNoSchema, 'N'),
  multiTab: optional(yesOrNoSchema, 'N'),
  pinned: optional(yesOrNoSchema, 'N'),
  ...routeFields
});

/** 更新菜单（字段同新增，全部可选） */
export const menuUpdateSchema = partial(menuCreateSchema);

/** 菜单分页查询 */
export const menuQuerySchema = intersect([
  paginationQuerySchema,
  object({
    menuType: optional(menuTypeSchema),
    name: optional(pipe(string(), description('菜单名称，模糊匹配'))),
    code: optional(pipe(string(), description('菜单编码，模糊匹配'))),
    parentId: optional(idSchema),
    requiresAuth: optional(yesOrNoSchema),
    enabled: optional(enabledSchema)
  })
]);

/** 路径是否已被占用（`POST /api/menu/exist-path`） */
export const menuExistPathSchema = object({
  routeName: optional(pipe(string(), description('待检查的路由名称'))),
  routePath: optional(pipe(string(), description('待检查的路由路径')))
});

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 菜单行字段（全表，新增 / 更新 / 详情 / 树共用） */
const menuRowFields = {
  id: idSchema,
  enabled: enabledSchema,
  parentId: rowText('父菜单 ID，顶层为 null'),
  name: pipe(string(), description('菜单名称')),
  code: pipe(string(), description('菜单编码，全局唯一')),
  menuType: menuTypeSchema,
  requiresAuth: pipe(yesOrNoSchema, description('是否需要登录态')),
  icon: rowText('图标名'),
  i18nKey: rowText('i18n 文案 key'),
  order: pipe(number(), integer(), description('排序值，数字越小越靠前')),
  iframeUrl: rowText('iframe 内嵌地址'),
  href: rowText('外链地址'),
  routePath: rowText('路由路径'),
  routeName: rowText('路由名称，与页面 definePage 一致'),
  routeLayout: rowText('布局组件标识'),
  routeComponent: rowText('页面组件路径'),
  routeRedirect: rowText('重定向目标路径'),
  routeQueries: nullable(pipe(record(string(), string()), description('固定 query 参数'))),
  routeParams: nullable(pipe(record(string(), string()), description('固定 route 参数'))),
  keepAlive: nullable(pipe(yesOrNoSchema, description('是否缓存页面'))),
  multiTab: nullable(pipe(yesOrNoSchema, description('是否支持多标签'))),
  pinned: nullable(pipe(yesOrNoSchema, description('是否固定在标签栏'))),
  description: rowText('备注说明'),
  ...auditFields
};

/** 菜单资源（新增 / 更新 / 详情响应） */
export const menuResourceSchema = object(menuRowFields);

/** `GET /api/menu/list` 响应 data */
export const menuPageSchema = pagedSchema(menuResourceSchema);

/** `POST /api/menu/exist-path` 响应 data */
export const menuExistPathResultSchema = object({
  exists: pipe(boolean(), description('路由名称 / 路径是否已被占用'))
});

/** `GET /api/menu/all` / `/api/menu/public` / `/api/menu/user` 响应 data（菜单行列表） */
export const menuListSchema = pipe(array(menuResourceSchema), description('菜单行列表'));

/** 菜单树节点类型（`children` 自引用递归） */
export type MenuTreeNode = InferOutput<typeof menuResourceSchema> & { children: MenuTreeNode[] };

/** 递归 schema 必须用 `metadata({ ref })` 显式命名，否则 OpenAPI 类型生成会失败： 详见 docs/v3-notes.md N-213。 */
const menuTreeSchema: GenericSchema<MenuTreeNode> = pipe(
  object({
    ...menuRowFields,
    children: array(lazy(() => menuTreeSchema))
  }),
  metadata({ ref: 'MenuTree' })
);

/** `GET /api/menu/tree` 响应 data（菜单树根节点列表） */
export const menuTreeListSchema = array(menuTreeSchema);

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 菜单列表搜索表单 */
export const menuSearchFormSchema = object({
  name: searchText('菜单名称'),
  code: searchText('菜单编码'),
  menuType: menuTypeSearchSchema,
  enabled: enabledSearchSchema
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/** 菜单新增 / 编辑表单 */
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
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增菜单的空表默认值 */
export const emptyMenuForm: MenuFormDTO = {
  parentId: null,
  menuType: 'menu',
  name: '',
  code: '',
  requiresAuth: 'Y',
  enabled: 'Y',
  icon: '',
  i18nKey: '',
  order: 0,
  iframeUrl: '',
  href: '',
  keepAlive: 'N',
  multiTab: 'N',
  pinned: 'N',
  routeName: '',
  routePath: '',
  routeLayout: '',
  routeComponent: '',
  routeRedirect: '',
  routeQueries: {},
  routeParams: {},
  description: null
};

/** 菜单行 → 编辑表单值 */
export function toMenuForm(row: MenuResource): MenuFormDTO {
  return {
    parentId: row.parentId,
    menuType: row.menuType,
    name: row.name,
    code: row.code,
    requiresAuth: row.requiresAuth,
    enabled: row.enabled,
    icon: text(row.icon),
    i18nKey: text(row.i18nKey),
    order: row.order,
    iframeUrl: text(row.iframeUrl),
    href: text(row.href),
    // 表单项是必填 'Y' | 'N'，行字段可空（历史数据）→ 缺省按未启用还原
    keepAlive: row.keepAlive ?? 'N',
    multiTab: row.multiTab ?? 'N',
    pinned: row.pinned ?? 'N',
    routeName: text(row.routeName),
    routePath: text(row.routePath),
    routeLayout: text(row.routeLayout),
    routeComponent: text(row.routeComponent),
    routeRedirect: text(row.routeRedirect),
    routeQueries: row.routeQueries ?? {},
    routeParams: row.routeParams ?? {},
    description: text(row.description)
  };
}

/** 菜单源数据（`src/menus/menus.json` 的 `menus` 数组），也是 static / dynamic 两种 详见 docs/v3-notes.md N-214。 */
export const menuSourceSchema = object({
  id: idSchema,
  parentId: optional(nullable(idSchema)),
  name: pipe(string(), nonEmpty('菜单名称不能为空')),
  code: pipe(string(), nonEmpty('菜单编码不能为空')),
  menuType: menuTypeSchema,
  requiresAuth: optional(nullable(yesOrNoSchema)),
  order: optional(nullable(pipe(number(), integer()))),
  icon: optional(nullable(string())),
  i18nKey: optional(nullable(string())),
  href: optional(nullable(string())),
  iframeUrl: optional(nullable(string())),
  routeName: optional(nullable(string())),
  routePath: optional(nullable(string())),
  routeLayout: optional(nullable(string())),
  routeComponent: optional(nullable(string())),
  routeRedirect: optional(nullable(string())),
  routeQueries: optional(nullable(record(string(), string()))),
  routeParams: optional(nullable(record(string(), string()))),
  keepAlive: optional(nullable(yesOrNoSchema)),
  multiTab: optional(nullable(yesOrNoSchema)),
  pinned: optional(nullable(yesOrNoSchema)),
  description: optional(nullable(string()))
});

/** `src/menus/menus.json` 的整个文件（`$schema` 这类额外键被 object() 丢弃） */
export const menuSourceFileSchema = object({ menus: array(menuSourceSchema) });

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type MenuResource = InferOutput<typeof menuResourceSchema>;
export type MenuList = InferOutput<typeof menuListSchema>;
export type MenuExistPathResult = InferOutput<typeof menuExistPathResultSchema>;
export type MenuTreeList = InferOutput<typeof menuTreeListSchema>;
export type MenuCreateDTO = InferOutput<typeof menuCreateSchema>;
export type MenuUpdateDTO = InferOutput<typeof menuUpdateSchema>;
export type MenuQuery = InferOutput<typeof menuQuerySchema>;
export type MenuExistPathDTO = InferOutput<typeof menuExistPathSchema>;
export type MenuSource = InferOutput<typeof menuSourceSchema>;
export type MenuSearchFormDTO = InferOutput<typeof menuSearchFormSchema>;
export type MenuFormDTO = InferOutput<typeof menuFormSchema>;
