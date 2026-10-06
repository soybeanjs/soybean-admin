import * as v from 'valibot';
import {
  batchDeleteSchema,
  enabledSchema,
  idParamSchema,
  idSchema,
  menuTypeSchema,
  orderSchema,
  paginationQuerySchema
} from './shared';

/** menu DTO（v3 §6.3，unify menu.service 范式） */

const routeFieldsSchema = {
  routeName: v.optional(v.nullable(v.string()), null),
  routePath: v.optional(v.nullable(v.string()), null),
  routeLayout: v.optional(v.nullable(v.string()), null),
  routeComponent: v.optional(v.nullable(v.string()), null),
  routeRedirect: v.optional(v.nullable(v.string()), null),
  routeQueries: v.optional(v.nullable(v.record(v.string(), v.string())), {}),
  routeParams: v.optional(v.nullable(v.record(v.string(), v.string())), {})
};

export const menuCreateSchema = v.object({
  parentId: v.optional(v.nullable(idSchema), null),
  menuType: menuTypeSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.nonEmpty()),
  requiresAuth: v.optional(v.picklist(['Y', 'N']), 'Y'),
  icon: v.optional(v.nullable(v.string()), null),
  i18nKey: v.optional(v.nullable(v.string()), null),
  order: orderSchema,
  iframeUrl: v.optional(v.nullable(v.string()), null),
  href: v.optional(v.nullable(v.string()), null),
  keepAlive: v.optional(v.picklist(['Y', 'N']), 'N'),
  multiTab: v.optional(v.picklist(['Y', 'N']), 'N'),
  pinned: v.optional(v.picklist(['Y', 'N']), 'N'),
  ...routeFieldsSchema
});
export type MenuCreateDTO = v.InferOutput<typeof menuCreateSchema>;

export const menuUpdateSchema = v.object({
  parentId: v.optional(v.nullable(idSchema)),
  menuType: v.optional(menuTypeSchema),
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  requiresAuth: v.optional(v.picklist(['Y', 'N'])),
  icon: v.optional(v.nullable(v.string())),
  i18nKey: v.optional(v.nullable(v.string())),
  order: v.optional(v.nullable(v.number())),
  iframeUrl: v.optional(v.nullable(v.string())),
  href: v.optional(v.nullable(v.string())),
  keepAlive: v.optional(v.picklist(['Y', 'N'])),
  multiTab: v.optional(v.picklist(['Y', 'N'])),
  pinned: v.optional(v.picklist(['Y', 'N'])),
  routeName: v.optional(v.nullable(v.string())),
  routePath: v.optional(v.nullable(v.string())),
  routeLayout: v.optional(v.nullable(v.string())),
  routeComponent: v.optional(v.nullable(v.string())),
  routeRedirect: v.optional(v.nullable(v.string())),
  routeQueries: v.optional(v.nullable(v.record(v.string(), v.string()))),
  routeParams: v.optional(v.nullable(v.record(v.string(), v.string())))
});
export type MenuUpdateDTO = v.InferOutput<typeof menuUpdateSchema>;

export const menuQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    menuType: v.optional(menuTypeSchema),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    parentId: v.optional(idSchema),
    requiresAuth: v.optional(v.picklist(['Y', 'N'])),
    enabled: v.optional(enabledSchema)
  })
]);
export type MenuQuery = v.InferOutput<typeof menuQuerySchema>;

export const menuBatchDeleteSchema = batchDeleteSchema;
export const menuIdParamSchema = idParamSchema;
