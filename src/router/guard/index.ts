import type { Router } from 'vue-router';
import { createProgressGuard } from './progress';
import { createDocumentTitleGuard } from './title';
import { createPermissionGuard } from './permission';

/**
 * router guard
 * @param router - router instance
 */
export function createRouterGuard(router: Router) {
  createProgressGuard(router);
  createPermissionGuard(router);
  createDocumentTitleGuard(router);
}
