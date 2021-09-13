import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { getToken, getLoginRedirectUrl } from '@/utils';
import { RouteNameMap, whitelistRoutes } from './routes';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export default function createRouterGuide(router: Router) {
  router.beforeEach((to, from, next) => {
    window.$loadingBar?.start();
    const token = getToken();
    if (whitelistRoutes.includes(to.name as string)) {
      if (to.name === RouteNameMap.get('login') && token) {
        next('/');
        return;
      }
      next();
      return;
    }
    if (token) {
      next();
    } else {
      const redirectUrl = getLoginRedirectUrl();
      next({ name: RouteNameMap.get('login'), query: { redirectUrl } });
    }
  });
  router.afterEach(to => {
    // 设置document title
    useTitle(to.meta.title as string);
    // 结束 loadingBar
    window.$loadingBar?.finish();
  });
}
