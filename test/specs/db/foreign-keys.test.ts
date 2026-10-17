import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { defineDatabase } from 'ubean/server';
import { runAppMigrations } from '@/db/migrations';
import { runSeed } from '@/db/seed';

/**
 * `ON DELETE CASCADE` 只有在连接上 `foreign_keys = ON` 时才生效，而 better-sqlite3
 * **默认是关的**。审计 1.4 指出 `appDb` 曾漏掉这条 pragma，导致迁移里所有级联
 * 声明形同虚设。这里用临时文件库走一遍真实连接工厂（`registerDb0Create` →
 * `openSqlite`），确保 pragma 真的被下发。
 */
describe('sqlite connection', () => {
  it('enables foreign_keys so cascades actually fire', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'soybean-fk-'));
    const db = defineDatabase({ connector: { dialect: 'sqlite', url: `file:${join(dir, 'fk.sqlite3')}` } });

    const pragma = await db.sql<{ foreign_keys: number }>`PRAGMA foreign_keys`;

    expect(Number(pragma.rows[0]?.foreign_keys)).toBe(1);

    await runAppMigrations(db);
    await runSeed(db);

    // dict_item.dict_id 是 ON DELETE CASCADE：删字典必须带走字典项
    await db.sql`INSERT INTO "dict" (id, name, code) VALUES (${'DIT_test'}, ${'测试字典'}, ${'it_test'})`;
    await db.sql`INSERT INTO "dict_item" (id, dict_id, label, value) VALUES (${'DITI_test'}, ${'DIT_test'}, ${'甲'}, ${'a'})`;
    await db.sql`DELETE FROM "dict" WHERE id = ${'DIT_test'}`;

    const items = await db.sql<{ c: number }>`SELECT count(*) AS c FROM "dict_item" WHERE dict_id = ${'DIT_test'}`;

    expect(Number(items.rows[0]?.c)).toBe(0);

    await db.close();
  });
});
