import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DEFAULT_RESOURCE_TYPE } from '@/constants/db';
import { auditColumns, baseColumns } from './shared';

/** 权限表（RBAC 权限点：API 权限码 `api:get:/path`、菜单/按钮授权 resourceId） */
export const permission = sqliteTable('permission', {
  ...baseColumns(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  resourceType: text('resource_type').notNull().default(DEFAULT_RESOURCE_TYPE),
  resourceId: text('resource_id'),
  description: text('description'),
  ...auditColumns
});

export type Permission = typeof permission.$inferSelect;
export type NewPermission = typeof permission.$inferInsert;
