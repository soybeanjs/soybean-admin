import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relationAuditColumns } from './shared';

/** 角色-权限关系表 */
export const rolePermission = sqliteTable('role_permission', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull(),
  permissionId: text('permission_id').notNull(),
  ...relationAuditColumns
});

export type RolePermission = typeof rolePermission.$inferSelect;
export type NewRolePermission = typeof rolePermission.$inferInsert;
