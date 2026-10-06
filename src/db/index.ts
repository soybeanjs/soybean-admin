import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { defineDatabase, registerDb0Create } from 'ubean/server';
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { serverEnv } from '@/env.server';
import * as schema from './schema';

/**
 * 数据库接线（v3 §6.2，P1-02）。
 *
 * ubean 的 `Database` 面是裸 `{ sql, exec, close }`；框架对 connector 的处理是：
 * 全局 `$db0Create` 未注册时**静默回落内存库**，因此必须在任何 defineDatabase
 * 调用前 `registerDb0Create` 显式接线：
 * - dev（默认）：SQLite 文件库（better-sqlite3，`?` 定位参数，同步驱动包一层 Promise）；
 * - prod：PostgreSQL（postgres-js，`$1` 定位参数）。
 *
 * 连接目标由 `DATABASE_URL` 决定：`file:` 前缀 → SQLite，其余 → Postgres；
 * 未设置时回落 `<cwd>/.data/dev.sqlite3`。
 *
 * 类型化查询走 `appDb`（drizzle 实例，复用同一条底层连接，不额外建池）：
 * - SQLite：drizzle-orm/better-sqlite3（同步 API，与 ubean Database 的 Promise 包装共存）；
 * - Postgres：drizzle-orm/postgres-js。
 */

type RawSqlFn = <T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<{ rows: T[] }>;
type RawDatabase = {
  sql: RawSqlFn;
  exec(query: string): Promise<void>;
  close(): Promise<void>;
};

/** rawSql(str) 产物识别（@ubean/server 用未导出的 Symbol('rawSql') 标记） */
function isRawSqlValue(value: unknown): value is { value: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.getOwnPropertySymbols(value).some(symbol => symbol.description === 'rawSql') &&
    'value' in value
  );
}

/** postgres-js 参数白名单守卫（ParameterOrJSON = SerializableParameter | JSONValue） */
function isSerializableValue(value: unknown): value is postgres.ParameterOrJSON<never> {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof Date ||
    (typeof value === 'object' && value !== null)
  );
}

/** 模板串拼装：rawSql 值做字面量替换，其余值按占位符风格（sqlite '?' / pg '$n'）参数化 */
function joinTemplate(
  strings: TemplateStringsArray,
  values: unknown[],
  placeholder: (index: number) => string
): string {
  const parts: string[] = [strings[0]];

  strings.slice(1).forEach((part, index) => {
    const value = values[index];

    if (isRawSqlValue(value)) {
      parts.push(value.value, part);
    } else {
      parts.push(placeholder(index), part);
    }
  });

  return parts.join('');
}

function createSqliteDatabase(url: string): RawDatabase {
  const filePath = url.replace(/^file:/, '') || '.data/dev.sqlite3';
  // better-sqlite3 不会自动建父目录，目标目录缺失时直接抛错
  mkdirSync(dirname(filePath), { recursive: true });
  // better-sqlite3 是同步驱动，包一层 Promise 以对齐 Database 接口
  const sqlite = new Database(filePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  const sql: RawSqlFn = async <T>(strings: TemplateStringsArray, ...values: unknown[]) => {
    const query = joinTemplate(strings, values, () => '?');
    // better-sqlite3：prepare<Bind, Result> 显式标注行类型；SELECT 走 all()，写语句走 run()
    const statement = sqlite.prepare<unknown[], T>(query);
    const isRead = /^\s*(SELECT|WITH|PRAGMA|EXPLAIN)/i.test(query);

    if (isRead) {
      return { rows: statement.all(...values) };
    }

    statement.run(...values);

    return { rows: [] };
  };

  return {
    sql,
    exec(query) {
      sqlite.exec(query);

      return Promise.resolve();
    },
    close() {
      sqlite.close();

      return Promise.resolve();
    }
  };
}

function createPostgresDatabase(url: string): RawDatabase {
  const client = postgres(url);

  const sql: RawSqlFn = async <T>(strings: TemplateStringsArray, ...values: unknown[]) => {
    // tagged template → '?' 语义由 postgres-js 处理；这里只做 $n 文本拼装（值全部经参数化传递）
    const query = joinTemplate(strings, values, index => `$${index + 1}`);
    const params = values.filter(isSerializableValue);
    const rows: T[] = await client.unsafe(query, params);

    return { rows };
  };

  return {
    // postgres-js tagged template 返回行数组（thenable PendingQuery），包一层对齐 { rows } 形状
    sql,
    async exec(queryText) {
      await client.unsafe(queryText);
    },
    async close() {
      await client.end({ timeout: 5 });
    }
  };
}

function isSqliteUrl(url: string): boolean {
  return url.startsWith('file:') || url.endsWith('.sqlite') || url.endsWith('.sqlite3') || url.startsWith('.data/');
}

function resolveDatabaseUrl(): string {
  return serverEnv.DATABASE_URL || 'file:.data/dev.sqlite3';
}

const resolvedUrl = resolveDatabaseUrl();
const isSqlite = isSqliteUrl(resolvedUrl);

/** 显式注册 db0 connector 工厂（模块加载即生效，先于任何 defineDatabase 调用） */
registerDb0Create(connector => {
  const url = typeof connector.url === 'string' && connector.url ? connector.url : resolvedUrl;

  if (!url || isSqliteUrl(url)) {
    return createSqliteDatabase(url);
  }

  return createPostgresDatabase(url);
});

/** 应用默认数据库（ubean Database 面：裸 sql/exec/close） */
export const appDatabase = defineDatabase({
  connector: { dialect: isSqlite ? 'sqlite' : 'postgresql', url: resolvedUrl }
});

export const isSqliteMode = isSqlite;

/**
 * 应用 drizzle 实例（类型化查询用）。
 *
 * 与 appDatabase 各自持有连接（ubean 不暴露内部连接，无法复用同一句柄）：
 * SQLite 是进程内文件库，两条连接共用 WAL 无冲突；Postgres 多一条池连接，可接受。
 * 服务层统一用 appDb；ubean 的 useDatabase()/appDatabase 仅框架侧（迁移账本等）使用。
 *
 * 实现说明：SQLite 与 Postgres 的 drizzle builder 类型不兼容（union 会让链式方法坍塌为
 * never/不可调用），而 v3 首版运行时以 SQLite 为准（生产接入 PG 时再为 appDb 建独立
 * 类型入口），这里用受控断言把实例收敛为 BetterSQLite3Database 形状。
 */
export const appDb = createAppDb();

function createAppDb(): BetterSQLite3Database<typeof schema> {
  if (isSqlite) {
    return drizzleSqlite(new Database(resolvedUrl.replace(/^file:/, '') || '.data/dev.sqlite3'), { schema });
  }

  // Postgres 的 drizzle builder 与 SQLite 类型不同构（union 会让链式方法坍塌为不可调用）；
  // v3 首版运行时以 SQLite 为准，这里经 unknown 边界转换，PG 专用类型入口随生产接入再建。
  const pgDb: unknown = drizzlePg(postgres(resolvedUrl), { schema });

  if (isBetterSQLite3Database(pgDb)) {
    return pgDb;
  }

  throw new Error('Unreachable: pg drizzle instance must satisfy the appDb shape');
}

/** appDb 形状守卫：PG 分支经 unknown 边界返回前做最小结构确认（避免双重断言） */
function isBetterSQLite3Database(value: unknown): value is BetterSQLite3Database<typeof schema> {
  return typeof value === 'object' && value !== null && 'select' in value && 'insert' in value && 'update' in value;
}
