import { description, intersect, nonEmpty, nullable, object, optional, partial, pipe, record, string } from 'valibot';
import type { InferOutput } from 'valibot';
import { enabledSchema, idSchema, menuTypeSchema, orderSchema, paginationQuerySchema, yesOrNoSchema } from './shared';

/**
 * 菜单 DTO（v3 §6.3，unify menu.service 范式）。
 *
 * 路由相关字段单独抽成 `routeFields`：新增与更新共用同一份值域，只有默认值
 * （新增带 `null` / `{}`，更新不带）与可选性不同。
 */

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

export type MenuCreateDTO = InferOutput<typeof menuCreateSchema>;
export type MenuUpdateDTO = InferOutput<typeof menuUpdateSchema>;
export type MenuQuery = InferOutput<typeof menuQuerySchema>;
export type MenuExistPathDTO = InferOutput<typeof menuExistPathSchema>;

export { batchDeleteSchema, idParamSchema } from './shared';
