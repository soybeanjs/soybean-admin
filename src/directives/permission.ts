import type { App, Directive } from 'vue';
import { useAuthStore } from '@/store';

export default function setupLoginDirective(app: App) {
  const auth = useAuthStore();

  const loginDirective: Directive<HTMLElement, Auth.RoleType | undefined> = {
    mounted(el: HTMLElement, binding) {
      if (binding.value !== auth.userInfo.userRole) {
        el.remove();
      }
    },
  };

  app.directive('login', loginDirective);
}
