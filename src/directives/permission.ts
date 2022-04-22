import type { App, Directive } from 'vue';
import { useAuthStore } from '@/store';
import { isArray, isString } from '@/utils';

export default function setupPermissionDirective(app: App) {
  const auth = useAuthStore();

  const permissionDirective: Directive<HTMLElement, Auth.RoleType | Auth.RoleType[]> = {
    mounted(el: HTMLElement, binding) {
      const { userRole } = auth.userInfo;
      const elPermission = binding.value;
      let hasPermission = userRole === 'super';
      if (!hasPermission) {
        if (isArray(elPermission)) {
          hasPermission = (elPermission as Auth.RoleType[]).includes(userRole);
        }
        if (isString(elPermission)) {
          hasPermission = (elPermission as Auth.RoleType) === userRole;
        }
      }
      if (!hasPermission) {
        el.remove();
      }
    }
  };

  app.directive('permission', permissionDirective);
}
