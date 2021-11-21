import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { useAppStore } from '@/store';
import { handlePagePermission } from './permission';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuide(router: Router) {
  const { resetScrollBehavior } = useAppStore();

  router.beforeEach((to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start();
    // 页面跳转逻辑
    handlePagePermission(to, from, next);
  });
  router.afterEach(to => {
    // 设置document title
    useTitle(to.meta.title as string);
    // 结束 loadingBar
    window.$loadingBar?.finish();
    // 重置滚动条行为
    resetScrollBehavior();
  });
}
