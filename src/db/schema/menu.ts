import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { DEFAULT_ORDER } from '@/constants/db';
import { auditColumns, baseColumns, MENU_TYPES } from './shared';
import type { MenuType } from './shared';

/**
 * 菜单表（unify menu 移植，最宽的业务表）。
 * 路由菜单（menu/page）与按钮/权限点（button）共用一张表，parentId 组成树。
 */
export const menu = sqliteTable(
  'menu',
  {
    ...baseColumns(),
    parentId: text('parent_id'),
    name: text('name').notNull(),
    code: text('code').notNull(),
    menuType: text('menu_type', { enum: MENU_TYPES }).notNull(),
    requiresAuth: text('requires_auth', { enum: ['Y', 'N'] })
      .notNull()
      .default('Y'),
    icon: text('icon'),
    i18nKey: text('i18n_key'),
    order: integer('order').notNull().default(DEFAULT_ORDER), // 迁移 DDL 为 integer
    iframeUrl: text('iframe_url'),
    href: text('href'),
    routePath: text('route_path'),
    routeName: text('route_name'),
    routeLayout: text('route_layout'),
    routeComponent: text('route_component'),
    routeRedirect: text('route_redirect'),
    routeQueries: text('route_queries', { mode: 'json' }).$type<Record<string, string>>(),
    routeParams: text('route_params', { mode: 'json' }).$type<Record<string, string>>(),
    keepAlive: text('keep_alive', { enum: ['Y', 'N'] }),
    multiTab: text('multi_tab', { enum: ['Y', 'N'] }),
    pinned: text('pinned', { enum: ['Y', 'N'] }),
    description: text('description'),
    ...auditColumns
  },
  table => [
    index('idx_menu_parent_order').on(table.parentId, table.order),
    index('idx_menu_enabled_auth_parent_order').on(table.enabled, table.requiresAuth, table.parentId, table.order),
    // 部分唯一：仅路由菜单（menu/page）需要 routeName/routePath 全局唯一
    uniqueIndex('uk_menu_route_name')
      .on(table.routeName)
      .where(sql`menu_type in ('menu', 'page') and route_name is not null`),
    uniqueIndex('uk_menu_route_path')
      .on(table.routePath)
      .where(sql`menu_type in ('menu', 'page') and route_path is not null`)
  ]
);

export type Menu = typeof menu.$inferSelect;
export type NewMenu = typeof menu.$inferInsert;
export type { MenuType };
