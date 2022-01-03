import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { useRouteStore } from '@/store';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuide(router: Router) {
  const routeStore = useRouteStore();
  const { initDynamicRoute } = useRouteStore();

  router.beforeEach(async (to, from, next) => {
    if (!routeStore.isAddedDynamicRoute) {
      await initDynamicRoute(router);
      next();
      return;
    }
    // 开始 loadingBar
    window.$loadingBar?.start();
    next();
  });
  router.afterEach(to => {
    // 设置document title
    useTitle(to.meta.title);
    // 结束 loadingBar
    window.$loadingBar?.finish();
  });
}
