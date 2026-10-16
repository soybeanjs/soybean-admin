import type { Router } from 'vue-router';
import { useTabStore } from '@/store';
import { isBrowserContext } from './context';

/**
 * 页签守卫（v3 §5.4）。
 *
 * `addTab(to)` 必须放在 `afterEach`：`beforeEach` 里目标路由还未 resolve，
 * `to.name` 可能是 `NotFound` 占位；`afterEach` 拿到的才是最终落地的记录。
 *
 * 与鉴权守卫一样要早退预渲染上下文 —— 页签读 `localStorage`（上一位用户的页签
 * 痕迹就是这么带到下一位的），在无 `window` 的环境里跑会直接抛。
 */
export function createTabGuard(router: Router): void {
  router.afterEach(to => {
    if (!isBrowserContext()) return;

    // i18nKey 的翻译在 layout 展示层做，store 只存 key
    useTabStore().addTab(to);
  });
}
