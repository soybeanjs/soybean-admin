import type { Router } from 'vue-router';
import { progress } from '@vean/ui';
import { APP_TITLE } from '@/constants';

/**
 * 全局路由守卫（由 `defineApp({ router: { setup } })` 注册）。
 *
 * - 顶部加载进度条：`@vean/ui` 的 `progress`（`ProgressObserver` 静态实例）。
 *   `SConfigProvider` 已自动挂载 `SProgressProvider`，**无需**手动包 Provider。
 * - 页面标题：`to.meta.title` 由 `definePage({ meta })` / 扫描器写入。
 *
 * 注意：`setup` 必须**同步**注册守卫（守卫体本身可以异步）。
 */
export function setupRouterGuard(router: Router): void {
  router.beforeEach(to => {
    progress.start();

    if (typeof document !== 'undefined') {
      const title = to.meta?.title;
      document.title = title ? `${String(title)} | ${APP_TITLE}` : APP_TITLE;
    }

    return true;
  });

  router.afterEach(() => {
    progress.done();
  });

  router.onError(() => {
    progress.done(true);
  });
}
