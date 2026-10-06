import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { auditColumns, baseColumns } from './shared';

/** 用户表 */
export const user = sqliteTable('user', {
  ...baseColumns(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  phone: text('phone'),
  email: text('email'),
  fullName: text('full_name'),
  avatar: text('avatar'),
  homePath: text('home_path').default('/home'),
  description: text('description'),
  ...auditColumns
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
