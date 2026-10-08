import { describe, expect, it } from 'vitest';
import { hasPermissionCode, hasRole, SUPER_ROLE } from './permission';

/**
 * 权限判定纯函数（`src/shared/permission.ts`）。
 *
 * 这两个函数被三处共用，行为必须一致：
 * - 路由级门禁：`src/router/guard.ts` 的 `to.meta.roles` → 不命中落 403；
 * - 指令：`src/directives/auth.ts` 的 `v-auth` / `v-auth:role` / `v-auth.super`；
 * - 组合式函数：`useAuth().hasAuth / hasAuthRole`。
 *
 * 守卫的这段判定逻辑在本文件里以 `shouldBlock` 复刻（守卫本身依赖
 * pinia/localStorage，无法直接单测），任何一边改了规则都应同步改这里。
 */

/** 守卫里「路由声明了 roles 且不命中 → 403」的等值复刻 */
function shouldBlock(userRoles: string[], declaredRoles: string[] | undefined): boolean {
  if (!declaredRoles) return false;

  return !hasRole(userRoles, declaredRoles);
}

describe('hasRole（角色码）', () => {
  it('超级角色恒通过，即使没有任何目标角色', () => {
    expect(hasRole([SUPER_ROLE], ['admin'])).toBe(true);
    expect(hasRole(['user', SUPER_ROLE], ['ghost'])).toBe(true);
  });

  it('required 为空数组视为放行（未被限制）', () => {
    expect(hasRole([], [])).toBe(true);
    expect(hasRole(['user'], [])).toBe(true);
  });

  it('任一角色命中即通过（并集语义，不是交集）', () => {
    expect(hasRole(['user'], ['admin', 'user'])).toBe(true);
    expect(hasRole(['user'], ['admin', 'auditor'])).toBe(false);
  });

  it('空角色列表对非空要求恒不通过', () => {
    expect(hasRole([], ['admin'])).toBe(false);
  });
});

describe('hasPermissionCode（权限码）', () => {
  it('任一权限码命中即通过', () => {
    expect(hasPermissionCode(['api:get:(/user/list)'], ['api:get:(/user/list)', 'system:user:add'])).toBe(true);
    expect(hasPermissionCode(['system:user:edit'], ['system:user:add'])).toBe(false);
  });

  it('required 为空视为放行', () => {
    expect(hasPermissionCode([], [])).toBe(true);
  });

  it('不做超级角色特判 —— 权限码被回收即不可见', () => {
    // 传入的 codes 就是 userInfo.buttons（超管是全量权限码）；
    // 若这里意外按角色短路，会掩盖「权限被回收」的回归。
    expect(hasPermissionCode(['api:get:(/role/list)'], ['system:user:delete'])).toBe(false);
  });

  it('与角色判定互相独立（权限码不因角色码相同而放行）', () => {
    const codes: string[] = [];
    const roles = [SUPER_ROLE];

    expect(hasRole(roles, ['super'])).toBe(true);
    expect(hasPermissionCode(codes, ['anything'])).toBe(false);
  });
});

describe('守卫 roles 判定的等值复刻', () => {
  it('未声明 roles 的路由永远放行', () => {
    expect(shouldBlock([], undefined)).toBe(false);
    expect(shouldBlock(['user'], undefined)).toBe(false);
  });

  it('声明 roles 且普通用户不命中 → 403（function/super-page 的场景）', () => {
    expect(shouldBlock(['user'], ['super'])).toBe(true);
  });

  it('声明 roles 且超管命中 → 放行', () => {
    expect(shouldBlock(['super'], ['super'])).toBe(false);
  });

  it('声明多角色时命中其一即放行', () => {
    expect(shouldBlock(['auditor'], ['super', 'auditor'])).toBe(false);
  });
});
