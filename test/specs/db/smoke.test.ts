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

    // 44 条 = src/menus/menus.json 的行数（菜单源文件是 seed 的输入，
    // 改造前这里手写 6 行 legacy 路由名，与真实页面对不上）
    const menus = await db.sql<{ c: number }>`SELECT count(*) AS c FROM menu`;
    expect(Number(menus.rows[0]?.c)).toBe(44);

    const menuRow = await db.sql`SELECT route_name, route_path FROM menu WHERE id = 'M_manage_user_index'`;
    expect(menuRow.rows[0]).toMatchObject({ route_name: 'ManageUserIndex', route_path: '/manage/user' });

    const perms = await db.sql<{ c: number }>`SELECT count(*) AS c FROM permission`;
    expect(Number(perms.rows[0]?.c)).toBe(9);

    // user 角色持有公开菜单 + 自身菜单 + 自身角色三个接口权限
    const rolePerms = await db.sql<{ c: number }>`SELECT count(*) AS c FROM role_permission WHERE role_id = 'R_user'`;
    expect(Number(rolePerms.rows[0]?.c)).toBe(3);

    await db.close();
    void appDatabase;
  });
});
