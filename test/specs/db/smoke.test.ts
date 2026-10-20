import { describe, expect, it } from 'vitest';
import { defineDatabase } from 'ubean/server';
import { appDatabase } from '@/db/index.ts';
import { runAppMigrations } from '@/db/migrations';
import { runSeed } from '@/db/seed';

/**
 * 迁移 + seed 幂等性冒烟（独立内存库，不污染 dev 库、可重复运行）。
 */
describe('db migrations + seed', () => {
  it('applies migrations and seeds idempotently', async () => {
    const db = defineDatabase({ connector: { dialect: 'sqlite', url: 'file::memory:' } });

    const applied = await runAppMigrations(db);
    expect(applied).toContain('0001-init-core-tables');

    await runSeed(db);
    const second = await runAppMigrations(db);
    expect(second).toEqual([]);
    await runSeed(db);

    const users = await db.sql`SELECT id, username, full_name, home_path FROM "user" ORDER BY username`;
    expect(users.rows.length).toBe(2);
    expect(users.rows[0]).toMatchObject({ username: 'admin' });

    // 菜单表**不再 seed**：static 模式的菜单直接从页面扫描结果派生（见
    // `src/store/modules/menu/derive.ts`），DB 菜单表只服务 dynamic 模式的 CRUD。
    // 所以开箱是空表 —— 这里锁住这个契约，避免以后悄悄改成灌数据。
    const menus = await db.sql<{ c: number }>`SELECT count(*) AS c FROM menu`;
    expect(Number(menus.rows[0]?.c)).toBe(0);

    const perms = await db.sql<{ c: number }>`SELECT count(*) AS c FROM permission`;
    expect(Number(perms.rows[0]?.c)).toBe(9);

    // user 角色持有公开菜单 + 自身菜单 + 自身角色三个接口权限
    const rolePerms = await db.sql<{ c: number }>`SELECT count(*) AS c FROM role_permission WHERE role_id = 'R_user'`;
    expect(Number(rolePerms.rows[0]?.c)).toBe(3);

    await db.close();
    void appDatabase;
  });
});
