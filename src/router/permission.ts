import type { Router } from 'vue-router';
import { NProgress } from '@/plugins';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export default function createRouterGuide(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });
  router.afterEach(() => {
    NProgress.done();
  });
}
