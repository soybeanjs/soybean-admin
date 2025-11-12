import type { Router } from 'vue-router';
import { createRouteGuard } from './route';
import { createProgressGuard } from './progress';
import { createDocumentTitleGuard } from './title';
import { createModuleGuard } from './module';

/**
 * Router guard
 *
 * @param router - Router instance
 */
export function createRouterGuard(router: Router) {
  createProgressGuard(router);
  createModuleGuard(router);
  createRouteGuard(router);
  createDocumentTitleGuard(router);
}
