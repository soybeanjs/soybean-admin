import type { App, Directive, DirectiveBinding } from 'vue';
import { hasPermissionCode, hasRole, SUPER_ROLE } from '@/shared/permission';
import { useAuthStore } from '@/store/modules/auth';

/** 用法： 详见 docs/v3-notes.md N-072。 */
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
