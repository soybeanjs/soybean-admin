import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relationAuditColumns } from './shared';

/** 组织-角色关系表 */
export const orgRole = sqliteTable('org_role', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  roleId: text('role_id').notNull(),
  ...relationAuditColumns
});

export type OrgRole = typeof orgRole.$inferSelect;
export type NewOrgRole = typeof orgRole.$inferInsert;
