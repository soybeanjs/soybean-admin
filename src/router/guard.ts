import type { Router } from 'vue-router';
import { progress } from '@vean/ui';
import { APP_LOCALES } from '@/constants';
import { hasRole } from '@/shared/permission';
import { stripLocalePrefix } from '@/shared/route';
import { shouldTreatMissingRouteAsForbidden } from '@/shared/route-exist';
import { initAuthStore, useAuthStore, useMenuStore, useTabStore } from '@/store';
import { env } from '@/env';
import { api } from '@/request';

/** 链路（v3 §5.2/§5.5）： 详见 docs/v3-notes.md N-080。 */
export function setupRouterGuard(instance: Router): void {
  /** 注册请求层登出回调 详见 docs/v3-notes.md N-081。 */
  initAuthStore(instance);

  const router = instance;

  router.beforeEach(async to => {
    progress.start();

    if (typeof window === 'undefined') return true;

    const authStore = useAuthStore();

    if (!authStore.isLogin) {
      // 公开页（如登录页 `requiresAuth: false`）放行；其余去登录页并记录来源
      return to.meta.requiresAuth === false ? true : { name: 'Login', query: { redirect: to.fullPath } };
    }

    // 已登录访问裸登录页 → 回首页（用户 homePath 优先）。
    // 例外：`?module=` 指向账号相关模块（注册/重置密码/绑定微信）时放行 ——
    // 这些模块在登录态同样有意义（绑定微信本身就是登录态操作）。
    if (to.name === 'Login' && !to.query.module) {
      return authStore.homePath;
    }

    // 恢复用户信息 + 初始化菜单（均幂等）
    const menuStore = useMenuStore();
    const menuWasInited = menuStore.inited;

    await authStore.initUserInfo();
    await menuStore.initMenu(router);

    // 路由级角色门禁（`definePage({ meta: { roles: [...] } })`）：角色码不命中 → 403。
    // 判定与 `v-auth:role` 共用 `@/shared/permission` 的纯函数（超级角色恒过）。
    const requiredRoles = to.meta.roles;

    if (requiredRoles && !hasRole(authStore.userInfo?.roles ?? [], requiredRoles)) {
      return { name: 'Forbidden', query: { from: to.fullPath } };
    }

    // `NotFound` 是内置路由名，不在 `.ubean/typed-router.d.ts` 的
    // RouteNamedMap 字面量并集里，转 string 比较（不引入 as 断言）。
    const isNotFound = String(to.name) === 'NotFound';

    // dynamic 模式首跳：目标路由可能刚由 initMenu 注册 —— 回跳原路径重新解析。
    if (!menuWasInited && env.authRouteMode === 'dynamic' && isNotFound) {
      return to.fullPath;
    }

    // dynamic 模式真 NotFound：反查后端菜单表。存在但无权限 → 403。
    // 网络异常时静默降级为 404（不能因反查失败阻塞导航）。
    if (isNotFound && env.authRouteMode === 'dynamic') {
      let routeExists = false;

      try {
        const { exists } = await api.post('/menu/exist-path', {
          body: { routePath: stripLocalePrefix(to.path, APP_LOCALES) }
        });
        routeExists = exists;
      } catch {
        routeExists = false;
      }

      if (shouldTreatMissingRouteAsForbidden({ authRouteMode: 'dynamic', menuInited: menuWasInited, routeExists })) {
        return { name: 'Forbidden', query: { from: to.fullPath } };
      }
    }

    return true;
  });

  router.afterEach(to => {
    progress.done();

    if (typeof window === 'undefined') return;

    // 页签：把目标路由加入页签并激活（i18nKey 翻译在 layout 展示层）
    useTabStore().addTab(to);
  });

  router.onError(() => {
    progress.done(true);
  });
}
