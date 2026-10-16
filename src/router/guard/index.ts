import type { Router } from 'vue-router';
import { createAuthGuard, initAuthGuardWiring } from './auth';
import { createProgressGuard } from './progress';
import { createTabGuard } from './tab';

export { isBrowserContext } from './context';
export { createAuthGuard, initAuthGuardWiring } from './auth';
export { createProgressGuard } from './progress';
export { createTabGuard } from './tab';

/**
 * 注册全部路由守卫（由 `defineApp({ router: { setup } })` 调用）。
 *
 * 拆成三个文件而不是一个 `beforeEach` 里塞三段流程：每条守卫能独立读、独立测，
 * 「进度条 / 鉴权 / 页签」三件事的注册时机（beforeEach / afterEach）也不再需要
 * 靠一长串注释解释。
 *
 * 注册顺序即执行顺序（vue-router 按注册序等待每个 `beforeEach`）：
 * 1. `createProgressGuard` —— 最外层，失败也要收进度条。
 * 2. `createAuthGuard` —— 可能 `await` 用户信息与菜单，需要进度条先在。
 * 3. `createTabGuard` —— 只挂 `afterEach`。
 *
 * `initAuthGuardWiring` 与注册顺序无关，但要在这里做：它是唯一拿到 router 实例
 * 的时机（详见 `./auth`）。
 */
export function createRouterGuard(router: Router): void {
  initAuthGuardWiring(router);
  createProgressGuard(router);
  createAuthGuard(router);
  createTabGuard(router);
}
