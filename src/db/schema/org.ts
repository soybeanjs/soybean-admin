import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { auditColumns, baseColumns } from './shared';

/** 组织表（parentId 自引用树） */
export const org = sqliteTable('org', {
  ...baseColumns(),
  parentId: text('parent_id'),
  name: text('name').notNull(),
  code: text('code').notNull(),
  description: text('description'),
  ...auditColumns
});

export type Org = typeof org.$inferSelect;
export type NewOrg = typeof org.$inferInsert;
