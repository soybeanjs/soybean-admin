import { STATIC_SUPER_ROLE } from '@/constants/service';

/** 两条通道粒度不同： 详见 docs/v3-notes.md N-163。 */

/** 超级角色码（`STATIC_SUPER_ROLE` 环境变量，与后端 seed 的角色码对齐） */
export const SUPER_ROLE = STATIC_SUPER_ROLE;

/**
 * 角色码判定：超级角色恒通过；`required` 为空视为「无需判定」；否则取用户角色与所需角色码的交集。
 */
export function hasRole(roles: string[], required: string[]): boolean {
  if (roles.includes(SUPER_ROLE)) return true;
  if (required.length === 0) return true;

  return required.some(code => roles.includes(code));
}

/** 权限码判定：所需的任一枚命中即可；`required` 为空视为放行 详见 docs/v3-notes.md N-165。 */
export function hasPermissionCode(codes: string[], required: string[]): boolean {
  if (required.length === 0) return true;

  // 路由守卫每次导航都会调用，用 Set 把 O(required × codes) 降成 O(required)
  const owned = new Set(codes);

  return required.some(code => owned.has(code));
}
