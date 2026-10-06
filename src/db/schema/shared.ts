import { integer, text } from 'drizzle-orm/sqlite-core';
import { DEFAULT_CREATED_BY, DEFAULT_UPDATED_BY } from '@/constants/db';
import { createUuidV7 } from '@/shared/uuid';

/**
 * 公共列（v3 §6.1 P1-08 数据模型约定）：
 * - 主键：UUID v7 字符串（应用层生成，趋势递增）；
 * - 软删/启用：`enabled` 'Y'|'N'|'D'（D = 已删除）；
 * - 审计四字段：createdBy/updatedBy/createdTime/updatedTime。
 *
 * SQLite 移植说明（源自 unify pg-core）：
 * - `timestamp mode:'string'` → `text`（ISO 字符串，DEFAULT 当前时间由应用层/默认表达式写入）；
 * - `jsonb` → `text({ mode: 'json' })`；
 * - boolean 语义列统一 `Y|N` 单字符（与 unify 一致）。
 */

/** enabled 列：'Y' 启用 / 'N' 停用 / 'D' 软删除 */
export const enabledColumn = text('enabled', { enum: ['Y', 'N', 'D'] })
  .notNull()
  .default('Y');

export const auditColumns = {
  createdBy: text('created_by').notNull().default(DEFAULT_CREATED_BY),
  createdTime: text('created_time').notNull().default("(datetime('now', 'localtime'))"),
  updatedBy: text('updated_by').notNull().default(DEFAULT_UPDATED_BY),
  updatedTime: text('updated_time').notNull().default("(datetime('now', 'localtime'))")
};

/** 关系表公共列（仅审计字段，无 enabled） */
export const relationAuditColumns = {
  createdBy: text('created_by').notNull().default(DEFAULT_CREATED_BY),
  createdTime: text('created_time').notNull().default("(datetime('now', 'localtime'))"),
  updatedBy: text('updated_by').notNull().default(DEFAULT_UPDATED_BY),
  updatedTime: text('updated_time').notNull().default("(datetime('now', 'localtime'))")
};

/** 业务表公共主键 + enabled */
export function baseColumns() {
  return {
    id: text('id').primaryKey().$defaultFn(createUuidV7),
    enabled: enabledColumn
  };
}

export const MENU_TYPES = ['directory', 'menu', 'page', 'iframe', 'link', 'button', 'other'] as const;
export type MenuType = (typeof MENU_TYPES)[number];

export const API_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
export type ApiMethod = (typeof API_METHODS)[number];

/** 整型排序列（menu.order / dictItem.order），列名 order 需引号 */
export const orderColumn = (name = 'order') => integer(name).notNull().default(0);
