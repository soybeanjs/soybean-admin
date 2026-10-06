import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { auditColumns, baseColumns } from './shared';

/** 角色表 */
export const role = sqliteTable('role', {
  ...baseColumns(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  description: text('description'),
  ...auditColumns
});

export type Role = typeof role.$inferSelect;
export type NewRole = typeof role.$inferInsert;
