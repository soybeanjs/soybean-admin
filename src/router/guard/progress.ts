import type { Router } from 'vue-router';

export function createProgressGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    window.NProgress?.start?.();
    next();
  });
  router.afterEach(_to => {
    window.NProgress?.done?.();
  });
}
