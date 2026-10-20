import { describe, expect, it } from 'vitest';
import { parse } from 'valibot';
import menusSource from '@/menus/menus.json';
import { menuSourceFileSchema } from '@/schema/menu';

/**
 * `src/menus/menus.json` 的类型契约（`menuType` × 路由字段的那几种合法组合）。
 *
 * 菜单行由 `pnpm menu:sync` 从页面文件派生，派生规则散在 `scripts/menu-sync.ts` 里；
 * 这里锁的是**产物**该长什么样 —— 六种 `menuType` 每一类允许哪些字段非空。 详见 docs/v3-notes.md N-461。
 */
const menus = parse(menuSourceFileSchema, menusSource).menus;

const byType = (type: string) => menus.filter(menu => menu.menuType === type);

describe('src/menus/menus.json 的 menuType 契约', () => {
  it('解析通过（Valibot 收窄，不是 JSON 字面量推导）', () => {
    expect(menus.length).toBeGreaterThan(0);
  });

  it('directory：有 routePath（子项前缀）但没有 routeName（它不是路由）', () => {
    const rows = byType('directory');

    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.routePath, `${row.id} 缺 routePath`).toBeTruthy();
      expect(row.routeName ?? null, `${row.id} 不该有 routeName`).toBeNull();
    }
  });

  it('link：只有 href，没有路由字段', () => {
    const rows = byType('link');

    expect(rows.length).toBeGreaterThan(0);

    // 写了 routeName 会让 dev 校验去路由表里查一条不存在的路由（每次启动告警）
    for (const row of rows) {
      expect(row.href, `${row.id} 缺 href`).toBeTruthy();
      expect(row.routeName ?? null, `${row.id} 不该有 routeName`).toBeNull();
      expect(row.routePath ?? null, `${row.id} 不该有 routePath`).toBeNull();
      expect(row.iframeUrl ?? null, `${row.id} 不该有 iframeUrl`).toBeNull();
    }
  });

  it('iframe：有 iframeUrl 与自成一体的路由（地址来自 meta，不靠查询串）', () => {
    const rows = byType('iframe');

    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.iframeUrl, `${row.id} 缺 iframeUrl`).toBeTruthy();
      expect(row.routeName, `${row.id} 缺 routeName`).toBeTruthy();
      expect(row.routePath, `${row.id} 缺 routePath`).toBeTruthy();
      expect(row.href ?? null, `${row.id} 不该有 href`).toBeNull();
    }
  });

  it('普通菜单：有路由字段，没有外链/内嵌地址', () => {
    for (const row of byType('menu')) {
      expect(row.routeName, `${row.id} 缺 routeName`).toBeTruthy();
      expect(row.routePath, `${row.id} 缺 routePath`).toBeTruthy();
      expect(row.href ?? null, `${row.id} 不该有 href`).toBeNull();
      expect(row.iframeUrl ?? null, `${row.id} 不该有 iframeUrl`).toBeNull();
    }
  });

  it('所有 id 唯一（重复会让建树时静默丢节点）', () => {
    const ids = menus.map(menu => menu.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('所有 parentId 都指向存在的条目（悬空父会让子项降级成一级菜单）', () => {
    const ids = new Set(menus.map(menu => menu.id));

    for (const row of menus) {
      if (!row.parentId) continue;

      expect(ids.has(row.parentId), `${row.id} 的 parentId ${row.parentId} 不存在`).toBe(true);
    }
  });
});
