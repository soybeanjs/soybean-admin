import { runMigrations } from '@ubean/server';
import type { Migration } from '@ubean/server';
import { appDatabase } from './index.ts';

/**
 * SQLite 建表 DDL（与 src/db/schema 13 表一一对应，v3 §6.1）。
 *
 * 约定（P1-08）：
 * - 主键 text（UUID v7，应用层 createUuidV7 生成）；
 * - enabled 'Y'|'N'|'D' 默认 'Y'，'D' 为软删；
 * - 审计四字段 createdBy/updatedBy/createdTime/updatedTime；
 * - 时间存本地时间字符串（drizzle text 列，default datetime('now','localtime')）。
 *
 * 注意：ubean runMigrations 的 Migration.up 是**纯 SQL 字符串**（直接 db.exec），
 * 不是回调。PostgreSQL 方言差异（uuid/jsonb/now()）上线前按 DATABASE_URL 裁剪。
 */

const AUDIT_COLUMNS = `created_by text not null default 'system',
  created_time text not null default (datetime('now','localtime')),
  updated_by text not null default 'system',
  updated_time text not null default (datetime('now','localtime'))`;

const ENABLED_CHECK = `enabled text not null default 'Y' check (enabled in ('Y', 'N', 'D'))`;

export const migrations: Migration[] = [
  {
    name: '0001-init-core-tables',
    up: `CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  phone text UNIQUE,
  email text UNIQUE,
  full_name text,
  avatar text,
  home_path text DEFAULT '/home',
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "role" (
  id text PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "permission" (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  resource_type text NOT NULL DEFAULT 'other',
  resource_id text,
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "api" (
  id text PRIMARY KEY,
  name text NOT NULL,
  path text NOT NULL,
  method text NOT NULL CHECK (method IN ('get', 'post', 'put', 'delete', 'patch', 'options', 'head')),
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "menu" (
  id text PRIMARY KEY,
  parent_id text REFERENCES "menu"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  menu_type text NOT NULL CHECK (menu_type IN ('directory', 'menu', 'page', 'iframe', 'link', 'button', 'other')),
  requires_auth text NOT NULL DEFAULT 'Y' CHECK (requires_auth IN ('Y', 'N')),
  icon text,
  i18n_key text,
  "order" integer NOT NULL DEFAULT 999,
  iframe_url text,
  href text,
  route_path text,
  route_name text,
  route_layout text,
  route_component text,
  route_redirect text,
  route_queries text,
  route_params text,
  keep_alive text CHECK (keep_alive IN ('Y', 'N')),
  multi_tab text CHECK (multi_tab IN ('Y', 'N')),
  pinned text CHECK (pinned IN ('Y', 'N')),
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE INDEX IF NOT EXISTS idx_menu_parent_order ON menu (parent_id, "order");
CREATE INDEX IF NOT EXISTS idx_menu_enabled_auth_parent_order ON menu (enabled, requires_auth, parent_id, "order");
CREATE UNIQUE INDEX IF NOT EXISTS uk_menu_route_name ON menu (route_name) WHERE menu_type IN ('menu', 'page') AND route_name IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uk_menu_route_path ON menu (route_path) WHERE menu_type IN ('menu', 'page') AND route_path IS NOT NULL;

CREATE TABLE IF NOT EXISTS "org" (
  id text PRIMARY KEY,
  parent_id text REFERENCES "org"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "dict" (
  id text PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  is_system text NOT NULL DEFAULT 'N' CHECK (is_system IN ('Y', 'N')),
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "dict_item" (
  id text PRIMARY KEY,
  dict_id text NOT NULL REFERENCES "dict"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  parent_id text REFERENCES "dict_item"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  description text,
  ${ENABLED_CHECK},
  ${AUDIT_COLUMNS}
);

CREATE INDEX IF NOT EXISTS idx_dict_item_dict_order ON dict_item (dict_id, "order");

CREATE TABLE IF NOT EXISTS "user_role" (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  role_id text NOT NULL,
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "role_permission" (
  id text PRIMARY KEY,
  role_id text NOT NULL,
  permission_id text NOT NULL,
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "org_role" (
  id text PRIMARY KEY,
  org_id text NOT NULL,
  role_id text NOT NULL,
  ${AUDIT_COLUMNS}
);

CREATE TABLE IF NOT EXISTS "user_org" (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  org_id text NOT NULL,
  ${AUDIT_COLUMNS}
);`
  },
  {
    // 0002：关联表补自然键唯一索引（幂等修数后建索引）。
    // 背景：0001 只给了 id 主键，而 seed 的关联行 id 每次启动随机生成，
    // INSERT OR IGNORE 永不命中 → 每次启动重复累积（dev 环境已累积 36 倍）。
    name: '0002-unique-keys-for-relation-tables',
    up: `DELETE FROM "user_role" WHERE id NOT IN (
  SELECT MIN(id) FROM "user_role" GROUP BY user_id, role_id
);
DELETE FROM "role_permission" WHERE id NOT IN (
  SELECT MIN(id) FROM "role_permission" GROUP BY role_id, permission_id
);
DELETE FROM "org_role" WHERE id NOT IN (
  SELECT MIN(id) FROM "org_role" GROUP BY org_id, role_id
);
DELETE FROM "user_org" WHERE id NOT IN (
  SELECT MIN(id) FROM "user_org" GROUP BY user_id, org_id
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_user_role ON "user_role" (user_id, role_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_role_permission ON "role_permission" (role_id, permission_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_org_role ON "org_role" (org_id, role_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_user_org ON "user_org" (user_id, org_id);`
  }
];

/** 幂等应用迁移（runMigrations 自带 _migrations 账本，重复调用安全） */
export async function runAppMigrations(db: Parameters<typeof runMigrations>['0'] = appDatabase) {
  const { applied } = await runMigrations(db, migrations);
  return applied;
}
