import type { Router } from 'vue-router';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export default function createRouterGuide(router: Router) {
  router.beforeEach((to, from, next) => {
    window.$loadingBar?.start();
    next();
  });
  router.afterEach(() => {
    window.$loadingBar?.finish();
  });
}
