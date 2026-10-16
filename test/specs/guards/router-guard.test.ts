import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 路由守卫链的静态纪律（P2-16 拆分后新增）。
 *
 * 为什么用静态断言而不是行为断言：守卫体的真实行为依赖 `localStorage`、pinia 活跃实例
 * 与后端反查，在 node 单测环境里全部走不到；而这次拆分最容易错的恰恰是**注册顺序**与
 * **早退判据的单一来源** —— 这两件事读源码就能准确判定。
 */
const routerDir = resolve(import.meta.dirname, '../../../src', 'router');
const guardDir = resolve(routerDir, 'guard');

const guardIndex = readFileSync(resolve(guardDir, 'index.ts'), 'utf-8');

/** 取某个守卫构造函数在 `createRouterGuard` 里的注册位置 */
function registrationIndex(name: string): number {
  return guardIndex.indexOf(`${name}(router)`);
}

function readGuard(name: string): string {
  return readFileSync(resolve(guardDir, name), 'utf-8');
}

describe('路由守卫链', () => {
  it('旧的单文件 guard.ts 已删除（守卫改为 guard/ 目录下按职责分文件）', () => {
    expect(existsSync(resolve(routerDir, 'guard.ts'))).toBe(false);
  });

  it('进度条守卫在鉴权守卫之前注册（鉴权要 await 用户信息与菜单，需要进度条先亮）', () => {
    const progress = registrationIndex('createProgressGuard');
    const auth = registrationIndex('createAuthGuard');

    expect(progress, 'createProgressGuard 未在 createRouterGuard 里注册').toBeGreaterThanOrEqual(0);
    expect(auth, 'createAuthGuard 未在 createRouterGuard 里注册').toBeGreaterThanOrEqual(0);
    expect(progress, 'createProgressGuard 必须排在 createAuthGuard 之前').toBeLessThan(auth);
  });

  it('页签守卫只挂 afterEach（beforeEach 里 to.name 可能还是 NotFound 占位）', () => {
    const tab = readGuard('tab.ts');

    expect(tab).toContain('router.afterEach');
    expect(tab).not.toContain('router.beforeEach');
  });

  it('进度条在 afterEach 收起、并在 onError 里也要收（导航报错不该让进度条卡在屏幕上）', () => {
    const progress = readGuard('progress.ts');

    expect(progress).toContain('router.beforeEach');
    expect(progress).toContain('router.afterEach');
    expect(progress).toContain('router.onError');
    expect(progress, 'onError 里必须 done(true)，否则失败的路由留下永久进度条').toContain('done(true)');
  });

  it('预渲染上下文早退的判据只有 context.ts 一处（勿在守卫里各写一份 typeof window）', () => {
    expect(readGuard('context.ts')).toContain("typeof window !== 'undefined'");

    for (const file of ['auth.ts', 'progress.ts', 'tab.ts', 'index.ts']) {
      expect(readGuard(file), `${file} 不应直接探测 typeof window，改调 isBrowserContext()`).not.toContain(
        'typeof window'
      );
    }
  });

  it('鉴权守卫对每个可能提前返回的分支都调用了 isBrowserContext()', () => {
    const auth = readGuard('auth.ts');

    expect(auth).toContain('if (!isBrowserContext()) return true;');
  });
});
