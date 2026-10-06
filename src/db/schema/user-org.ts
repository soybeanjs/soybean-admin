import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relationAuditColumns } from './shared';

/** 用户-组织关系表 */
export const userOrg = sqliteTable('user_org', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  orgId: text('org_id').notNull(),
  ...relationAuditColumns
});

export type UserOrg = typeof userOrg.$inferSelect;
export type NewUserOrg = typeof userOrg.$inferInsert;
