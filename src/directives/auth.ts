import type { App, Directive, DirectiveBinding } from 'vue';
import { hasPermissionCode, hasRole, SUPER_ROLE } from '@/shared/permission';
import { useAuthStore } from '@/store/modules/auth';

/**
 * `v-auth` 权限指令 + `useAuth()` 组合式函数（v3 §4.6 按钮级权限）。
 *
 * 判定逻辑是纯函数（`@/shared/permission`），本文件只负责取 store 与
 * 指令生命周期；守卫里的路由级 roles 判定复用同一组纯函数。
 *
 * 用法：
 * - `v-auth="['system:user:add']"` —— 权限码（默认通道，`userInfo.buttons`）
 * - `v-auth:role="['admin']"` —— 角色码（`userInfo.roles`）
 * - `v-auth.super` —— 仅超级角色
 *
 * 指令只在 `mounted` 执行一次（与 v2 语义一致：按钮可见性不随运行期切换，
 * 切账号后走整页重载）。判定值必须是**静态字面量数组**。
 */
export function useAuth() {
  const authStore = useAuthStore();

  /** 是否拥有任一所需**权限码**（按钮级；`userInfo.buttons`） */
  function hasAuth(required: string[] = []): boolean {
    const codes = authStore.userInfo?.buttons ?? [];

    return hasPermissionCode(codes, required);
  }

  /** 是否拥有任一所需**角色码**（`userInfo.roles`） */
  function hasAuthRole(required: string[] = []): boolean {
    const roles = authStore.userInfo?.roles ?? [];

    return hasRole(roles, required);
  }

  return { hasAuth, hasAuthRole };
}

/** `v-auth` 指令实现（无权限时移除元素） */
const authDirective: Directive<HTMLElement, string[] | undefined> = {
  mounted(el, binding: DirectiveBinding<string[] | undefined>) {
    const { hasAuth, hasAuthRole } = useAuth();
    const required = binding.value ?? [];
    const allowed = binding.modifiers.super
      ? hasAuthRole([SUPER_ROLE])
      : binding.modifiers.role
        ? hasAuthRole(required)
        : hasAuth(required);

    if (!allowed) {
      el.remove();
    }
  }
};

/** 安装全部指令（`v-auth`）。由 `src/app.ts` 的 `onAppCreated` 调用 */
export function setupAuthDirectives(app: App): void {
  app.directive('auth', authDirective);
}

export { hasPermissionCode, hasRole };
