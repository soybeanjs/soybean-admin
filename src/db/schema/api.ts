import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { API_METHODS, auditColumns, baseColumns } from './shared';
import type { ApiMethod } from './shared';

/** 接口表（API 清单，RBAC 权限码资源来源） */
export const api = sqliteTable('api', {
  ...baseColumns(),
  name: text('name').notNull(),
  path: text('path').notNull(),
  method: text('method', { enum: API_METHODS }).notNull(),
  description: text('description'),
  ...auditColumns
});

export type Api = typeof api.$inferSelect;
export type NewApi = typeof api.$inferInsert;
export type { ApiMethod };
