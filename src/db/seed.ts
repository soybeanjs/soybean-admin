import type { Database } from '@ubean/server';
import {
  seedApis,
  seedDictItems,
  seedDicts,
  seedMenus,
  seedPermissions,
  seedRolePermissions,
  seedRoles,
  seedUserRoles,
  seedUsers
} from './seed-data';
import { appDatabase } from './index.ts';

/**
 * Seed 执行器（幂等：INSERT OR IGNORE，可重复执行）。
 *
 * 数据本体在 ./seed-data.ts（纯数据，便于测试复用与检视）。
 * SQL 拼接安全性：表名/列名来自代码内白名单（toSnake 转换），值经
 * db.sql 的 escapeValue（单引号翻倍）转义——seed 无任何用户输入。
 */

type SeedRow = Record<string, unknown>;
type InsertSpec = { table: string; rows: SeedRow[] };

const TABLE_BY_SEED: Record<string, InsertSpec> = {
  users: { table: 'user', rows: seedUsers },
  roles: { table: 'role', rows: seedRoles },
  menus: { table: 'menu', rows: seedMenus },
  permissions: { table: 'permission', rows: seedPermissions },
  userRoles: { table: 'user_role', rows: seedUserRoles },
  rolePermissions: { table: 'role_permission', rows: seedRolePermissions },
  apis: { table: 'api', rows: seedApis },
  dicts: { table: 'dict', rows: seedDicts },
  dictItems: { table: 'dict_item', rows: seedDictItems }
} as const;

/** camelCase → snake_case（drizzle 列名约定） */
function toSnake(key: string) {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/** 单引号转义（SQLite 字面量） */
function escapeValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function insertIgnore(db: Database, spec: InsertSpec) {
  for (const row of spec.rows) {
    const entries = Object.entries(row).filter(([, value]) => value !== undefined);
    const columns = entries.map(([key]) => `"${toSnake(key)}"`).join(', ');
    const values = entries.map(([, value]) => escapeValue(value)).join(', ');

    await db.exec(`INSERT OR IGNORE INTO "${spec.table}" (${columns}) VALUES (${values})`);
  }
}

/** 执行 seed（幂等） */
export async function runSeed(db: Database = appDatabase) {
  for (const spec of Object.values(TABLE_BY_SEED)) {
    await insertIgnore(db, spec);
  }
}
