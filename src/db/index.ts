import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { defineDatabase, registerDb0Create } from 'ubean/server';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DATABASE_URL as ENV_DATABASE_URL } from 'ubean:env/server';
import * as schema from './schema';

/** `$db0Create` 未注册时 `defineDatabase` 静默回落内存库，必须在使用前调 `registerDb0Create` 接线。详见 docs/v3-notes.md N-225。 */

type RawSqlFn = <T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<{ rows: T[] }>;

type RawDatabase = {
  sql: RawSqlFn;
  exec(query: string): Promise<void>;
  close(): Promise<void>;
};

/** `rawSql(str)` 产物识别（`@ubean/server` 用未导出的 `Symbol('rawSql')` 标记） */
function isRawSqlValue(value: unknown): value is { value: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.getOwnPropertySymbols(value).some(symbol => symbol.description === 'rawSql') &&
    'value' in value
  );
}

/**
 * 模板串拼装。`rawSql` 值做字面量拼接（`runMigrations` 用它注入表名，如
 * ``sql`SELECT name FROM ${rawSql('_migrations')}` ``），其余值走 `?` 占位符参数化。
 */
function joinTemplate(strings: TemplateStringsArray, values: unknown[]): string {
  return strings.raw.reduce((query, part, index) => {
    if (index === 0) return part;

    const value = values[index - 1];
    const placeholder = isRawSqlValue(value) ? value.value : '?';

    return query + placeholder + part;
  }, '');
}

/** v3 首版运行时只支持 SQLite（迁移脚本用 `datetime('now','localtime')`、服务层全走 `.get()`/`.all()`） */
function resolveDatabaseFile(url: string): string {
  return url.replace(/^file:/, '') || '.data/dev.sqlite3';
}

function openSqlite(filePath: string): Database.Database {
  // better-sqlite3 不会自动建父目录，目标目录缺失时直接抛错
  mkdirSync(dirname(filePath), { recursive: true });

  const sqlite = new Database(filePath);

  // WAL 提升并发读；`foreign_keys` 必须显式打开 —— better-sqlite3 默认关闭，
  // 而 `src/db/migrations.ts` 里的 `ON DELETE CASCADE` 全靠它才生效（审计 1.4）。
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  return sqlite;
}

function createSqliteDatabase(filePath: string): RawDatabase {
  // better-sqlite3 是同步驱动，包一层 Promise 以对齐 Database 接口
  const sqlite = openSqlite(filePath);

  const sql: RawSqlFn = async <T>(strings: TemplateStringsArray, ...values: unknown[]) => {
    const query = joinTemplate(strings, values);
    // rawSql 拼接的值不进参数列表（它们已经是 SQL 字面量）
    const params = values.filter(value => !isRawSqlValue(value));
    // better-sqlite3：prepare<Bind, Result> 显式标注行类型；SELECT 走 all()，写语句走 run()
    const statement = sqlite.prepare<unknown[], T>(query);
    const isRead = /^\s*(SELECT|WITH|PRAGMA|EXPLAIN)/i.test(query);

    if (isRead) {
      return { rows: statement.all(...params) };
    }

    statement.run(...params);

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

function resolveDatabaseUrl(): string {
  return ENV_DATABASE_URL || 'file:.data/dev.sqlite3';
}

const resolvedUrl = resolveDatabaseUrl();
const databaseFile = resolveDatabaseFile(resolvedUrl);

/** 显式注册 db0 connector 工厂（模块加载即生效，先于任何 defineDatabase 调用） */
registerDb0Create(connector => {
  const url = typeof connector.url === 'string' && connector.url ? connector.url : resolvedUrl;

  return createSqliteDatabase(resolveDatabaseFile(url));
});

/** 应用默认数据库（ubean Database 面：裸 sql/exec/close） */
export const appDatabase = defineDatabase({
  connector: { dialect: 'sqlite', url: resolvedUrl }
});

/** 与 appDatabase 各自持有连接（ubean 不暴露内部连接，无法复用同一句柄）： 详见 docs/v3-notes.md N-226。 */
export const appDb: BetterSQLite3Database<typeof schema> = drizzle(openSqlite(databaseFile), { schema });
