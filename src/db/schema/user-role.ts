import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relationAuditColumns } from './shared';

/** 用户-角色关系表 */
export const userRole = sqliteTable('user_role', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  roleId: text('role_id').notNull(),
  ...relationAuditColumns
});

export type UserRole = typeof userRole.$inferSelect;
export type NewUserRole = typeof userRole.$inferInsert;
