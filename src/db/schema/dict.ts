import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { auditColumns, baseColumns } from './shared';

/** 字典表 */
export const dict = sqliteTable(
  'dict',
  {
    ...baseColumns(),
    name: text('name').notNull(),
    code: text('code').notNull(),
    isSystem: text('is_system', { enum: ['Y', 'N'] })
      .notNull()
      .default('N'),
    description: text('description'),
    ...auditColumns
  },
  table => [uniqueIndex('uk_dict_code').on(table.code)]
);

export type Dict = typeof dict.$inferSelect;
export type NewDict = typeof dict.$inferInsert;
