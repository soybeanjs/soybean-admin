import type { Router } from 'vue-router';
import { progress } from '@vean/ui';

/**
 * 顶部进度条守卫（P2-16）。
 *
 * `progress` 来自 `@vean/ui`，`SConfigProvider` 已自动挂载 `SProgressProvider`，
 * 无需手动包 Provider。`onError` 里 `done(true)` 让失败的路由也收起进度条 ——
 * 没有这一条时导航报错会让进度条永远停在屏幕上。
 *
 * 这一条必须排在鉴权守卫**之前**注册：vitest 与真实运行时都按注册顺序等待每个
 * `beforeEach`，进度条先起，后面守卫里的 `await` 才有可见反馈。
 */
export function createProgressGuard(router: Router): void {
  router.beforeEach(() => {
    progress.start();
  });

  router.afterEach(() => {
    progress.done();
  });

  router.onError(() => {
    progress.done(true);
  });
}
