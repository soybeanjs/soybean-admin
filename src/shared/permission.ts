import { STATIC_SUPER_ROLE } from '@/constants/service';

/**
 * 权限判定纯函数（v3 §4.6）。放在 `src/shared/` 而非 `@/directives/auth`：
 * 路由守卫（`src/router/guard.ts`）与指令（`v-auth`）共用同一判定，且纯函数
 * 可单测（`src/shared/permission.test.ts`）—— 指令模块带 Vue 运行时依赖，
 * 不适合被守卫静态引入。
 *
 * 两条通道粒度不同：
 * - **权限码**（`hasPermissionCode`）：`userInfo.buttons`，按钮级；
 * - **角色码**（`hasRole`）：`userInfo.roles`，路由/菜单级。
 */

/** 超级角色码（`VITE_STATIC_SUPER_ROLE`，与后端 seed 的角色码对齐） */
export const SUPER_ROLE = STATIC_SUPER_ROLE;

/**
 * 角色码判定：超级角色恒通过；`required` 为空视为「无需判定」；
 * 否则取用户角色与所需角色码的交集。
 *
 * @param roles 用户角色码（`userInfo.roles`）
 * @param required 需要的角色码（任一命中即可）
 */
export function hasRole(roles: string[], required: string[]): boolean {
  if (roles.includes(SUPER_ROLE)) return true;
  if (required.length === 0) return true;

  return required.some(code => roles.includes(code));
}

/**
 * 权限码判定：所需的任一枚命中即可；`required` 为空视为放行。
 *
 * 不做超级角色特判 —— seed 已把全量权限授予 super 角色，`buttons` 是全量
 * 权限码；特判反而会让「权限码被回收」在超管身上测不出来。
 *
 * @param codes 用户权限码（`userInfo.buttons`）
 * @param required 需要的权限码
 */
export function hasPermissionCode(codes: string[], required: string[]): boolean {
  if (required.length === 0) return true;

  return required.some(code => codes.includes(code));
}
