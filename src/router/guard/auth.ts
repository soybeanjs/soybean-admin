import type { Router } from 'vue-router';
import { AUTH_ROUTE_MODE as ENV_AUTH_ROUTE_MODE } from 'ubean:env/client';
import { APP_LOCALES } from '@/constants';
import { hasRole } from '@/shared/permission';
import { stripLocalePrefix } from '@/shared/route';
import { shouldTreatMissingRouteAsForbidden } from '@/shared/route-exist';
import { initAuthStore, useAuthStore, useMenuStore } from '@/store';
import { api } from '@/request';
import { isBrowserContext } from './context';

/**
 * 鉴权守卫（P2-16）。
 *
 * 顺序就是语义，改动前先读这几条：
 * 1. **浏览器早退**：见 `./context` —— 预渲染上下文里没有 `localStorage`，
 *    跑鉴权会无限重定向。
 * 2. **未登录**：公开页（`requiresAuth: false`）放行，其余去登录页并记 `redirect`。
 * 3. **已登录访问登录页**：回 `homePath`。例外是 `?module=`（注册/重置密码/绑定微信）
 *    —— 这些模块在登录态同样有意义（绑定微信本身就是登录态操作）。
 * 4. **用户信息 + 菜单初始化**：两者都幂等，守卫每次导航都调也无副作用。
 * 5. **角色门禁**：`definePage({ meta: { roles: [...] } })`，与 `v-auth:role`
 *    共用 `@/shared/permission` 的纯函数（超级角色恒过）。
 * 6. **dynamic 首跳补偿**：目标路由可能刚由 `initMenu` 注册 —— 回跳原路径重新解析。
 * 7. **404 vs 403**：dynamic 模式路由按权限下发，菜单里存在但无权 → 路由没注册
 *    → 落 `NotFound`。此时反查 `POST /api/menu/exist-path`，路径存在即改判 403
 *    （v3 §4.2）。static 模式路由本地全注册，落 NotFound 就是真 404，不查后端。
 *    反查前用 `stripLocalePrefix` 剥掉实际地址里的语言前缀（`/en/about` → `/about`），
 *    菜单的 `routePath` 一律无前缀，不剥就永远查不到；网络异常静默降级为 404
 *    （不能因反查失败阻塞导航）。
 *
 * ⚠️ 公开页判定读的是 `to.meta.requiresAuth`，因此页面必须写成
 * `definePage({ meta: { requiresAuth: false } })`。ubean 0.6.0 生成器只发射
 * 顶层 `requiresAuth: true`，顶层 `false` 被静默丢弃 → 本守卫会把登录页自己
 * 也重定向到登录页，形成无限重定向（真浏览器里 CPU 打满卡死）。
 * 回归保护见 `test/specs/guards/page-meta-guard.test.ts`。
 */
export function createAuthGuard(router: Router): void {
  router.beforeEach(async to => {
    if (!isBrowserContext()) return true;

    const authStore = useAuthStore();

    if (!authStore.isLogin) {
      return to.meta.requiresAuth === false ? true : { name: 'LoginIndex', query: { redirect: to.fullPath } };
    }

    if (to.name === 'LoginIndex' && !to.query.module) {
      return authStore.homePath;
    }

    const menuStore = useMenuStore();
    const menuWasInited = menuStore.inited;

    await authStore.initUserInfo();
    await menuStore.initMenu(router);

    const requiredRoles = to.meta.roles;

    if (requiredRoles && !hasRole(authStore.userInfo?.roles ?? [], requiredRoles)) {
      return { name: 'Forbidden', query: { from: to.fullPath } };
    }

    // `NotFound` 是内置路由名，不在 `.ubean/typed-router.d.ts` 的
    // RouteNamedMap 字面量并集里，转 string 比较（不引入 as 断言）。
    const isNotFound = String(to.name) === 'NotFound';

    if (!menuWasInited && ENV_AUTH_ROUTE_MODE === 'dynamic' && isNotFound) {
      return to.fullPath;
    }

    if (isNotFound && ENV_AUTH_ROUTE_MODE === 'dynamic') {
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
}

/**
 * 注册请求层登出回调与「重置收尾」回调。
 *
 * 放在守卫模块（而不是 `src/app.ts` 模块顶层）是因为回调要跳登录页，需要 router
 * 实例 —— `createRouterGuard` 是框架唯一把实例交到应用手里的时候。
 * 回调体仍动态 import store / 组件库：`router.setup` 在 pinia 安装之前执行，
 * 此刻取不到活跃 pinia。
 */
export function initAuthGuardWiring(router: Router): void {
  initAuthStore(router);
}
