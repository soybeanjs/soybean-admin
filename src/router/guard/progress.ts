import type { Router } from 'vue-router';

export function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    window.NProgress?.start?.();
    return;
  });
  router.afterEach(() => {
    window.NProgress?.done?.();
  });
}
