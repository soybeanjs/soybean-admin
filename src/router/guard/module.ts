import type { Router } from 'vue-router';
import { useRouteStore } from '@/store/modules/route';

export function createModuleGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const routeStore = useRouteStore();
    const module = to.meta.module as UnionKey.MenuModule;
    const targetModule = module || 'admin';
    // 只有当模块发生变化时才更新
    if (routeStore.currentModule !== targetModule) {
      routeStore.setCurrentModule(targetModule);
    }
    next();
  });
}
