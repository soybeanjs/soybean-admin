import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { auditColumns, baseColumns, orderColumn } from './shared';

/** 字典项表（dictId 归属 + parentId 自引用树） */
export const dictItem = sqliteTable(
  'dict_item',
  {
    ...baseColumns(),
    dictId: text('dict_id').notNull(),
    parentId: text('parent_id'),
    label: text('label').notNull(),
    value: text('value').notNull(),
    order: orderColumn('order'),
    ...auditColumns
  },
  table => [index('idx_dict_item_dict_order').on(table.dictId, table.order)]
);

export type DictItem = typeof dictItem.$inferSelect;
export type NewDictItem = typeof dictItem.$inferInsert;
