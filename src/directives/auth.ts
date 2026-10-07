import type { App, Directive, DirectiveBinding } from 'vue';
import { STATIC_SUPER_ROLE } from '@/constants/service';
import { useAuthStore } from '@/store/modules/auth';

/**
 * 权限指令与组合式函数（v3 §5.5 权限，static 模式按角色码判定）。
 *
 * - `v-auth="['admin']"`：角色码任一命中才渲染（未命中直接移除元素）。
 * - `v-auth.super`：仅 `STATIC_SUPER_ROLE` 可见。
 * - `useAuth()`：同判定的函数式出口（`hasAuth(codes)`），菜单/按钮逻辑用。
 *
 * 判定规则（与 v2 对齐）：超级角色恒可见；否则取用户角色与传入角色码的
 * 交集。dynamic 权限模式（后端按钮级权限）预留 `mode` 扩展，Phase 2 先做
 * static 角色。
 */

/** 超级角色码（`VITE_STATIC_SUPER_ROLE`，与后端 seed 的角色码对齐） */
const SUPER_ROLE = STATIC_SUPER_ROLE;

/**
 * 角色码判定（纯函数）。
 *
 * @param roles 用户角色码
 * @param required 需要的角色码（任一命中即可）
 */
export function hasRole(roles: string[], required: string[]): boolean {
  if (roles.includes(SUPER_ROLE)) return true;
  if (required.length === 0) return true;

  return required.some(code => roles.includes(code));
}

/** 权限组合式函数（setup 上下文用；指令内部也走这里） */
export function useAuth() {
  const authStore = useAuthStore();

  /**
   * 当前用户是否拥有任一所需角色
   *
   * @param required 需要的角色码（缺省只判断超级角色）
   */
  function hasAuth(required: string[] = []): boolean {
    const roles = authStore.userInfo?.roles ?? [];

    return hasRole(roles, required);
  }

  return { hasAuth };
}

/** `v-auth` 指令实现（无权限时移除元素） */
const authDirective: Directive<HTMLElement, string[] | undefined> = {
  mounted(el, binding: DirectiveBinding<string[] | undefined>) {
    const { hasAuth } = useAuth();
    // 修饰符 `.super` → 仅超级角色
    const required = binding.modifiers.super ? [SUPER_ROLE] : (binding.value ?? []);

    if (!hasAuth(required)) {
      el.remove();
    }
  }
};

/** 安装全部指令（`v-auth`）。由 `src/app.ts` 或页面侧按需接入 */
export function setupAuthDirectives(app: App): void {
  app.directive('auth', authDirective);
}
