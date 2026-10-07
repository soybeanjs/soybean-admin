import type { Router } from 'vue-router';
import { progress } from '@vean/ui';
import { useAuthStore, useMenuStore, useTabStore } from '@/store';
import { env } from '@/env';
import { installRouter } from './instance';

/**
 * 全局路由守卫（由 `defineApp({ router: { setup } })` 注册）。
 *
 * 链路（v3 §5.2/§5.5）：
 * 1. 进度条：`@vean/ui` 的 `progress`（`SConfigProvider` 已自动挂载
 *    `SProgressProvider`，无需手动包 Provider）。
 * 2. 登录跳转：未登录访问需鉴权页 → `Login`（带 `redirect` 回跳参数）；
 *    已登录访问登录页 → 回 `homePath`。
 * 3. 用户/菜单初始化：`initUserInfo`（幂等补拉）+ `initMenu`（static 派生 /
 *    dynamic 拉取 + `addRoute`）。dynamic 模式首跳目标若因路由未注册而落
 *    `NotFound`，初始化后重定向原路径让 router 重新解析（真 404 第二次仍会
 *    正常落 NotFound，不会死循环）。
 *
 * ⚠️ vp dev 关键约束（实测教训，勿回退）：
 * ubean dev 的 HTML 请求会在 **Node 里预渲染执行应用与守卫**，且该上下文带
 * 「client 编译标志」—— `import.meta.server === false`（不可用它判定！），
 * 但 `window`/`localStorage` 均不存在。守卫若在此上下文跑鉴权重定向，会因
 * `localStorage` 缺失恒判未登录而无限重定向（挂起请求或 dev 进程崩溃）。
 * 因此守卫体首行必须以 `typeof window === 'undefined'` 早退放行，鉴权只在
 * 真浏览器执行（客户端水合后再跳转，语义不变）。
 *
 * 模块依赖：本文件静态 import `@/store`（守卫运行时 Pinia 已安装）；
 * store 反向拿 router 只准走 `./instance` 的 `getRouter()`（叶子模块），
 * 不准 `import { router } from '@/router'` —— index 会拉回 guard 形成环。
 *
 * `setup` 必须**同步**注册守卫（回调可异步）。页面标题不在这里设置 ——
 * `useI18n()` 只能在 setup 上下文用，标题的 i18n 解析统一放 `src/app.vue`
 * 的 watcher（见该文件）。
 */
export function setupRouterGuard(instance: Router): void {
  installRouter(instance);

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
    await menuStore.initMenu();

    // dynamic 模式首跳：目标路由可能刚由 initMenu 注册 —— 回跳原路径重新解析。
    // `NotFound` 是内置路由名，不在 `.ubean/typed-router.d.ts` 的
    // RouteNamedMap 字面量并集里，转 string 比较（不引入 as 断言）。
    if (!menuWasInited && env.authRouteMode === 'dynamic' && String(to.name) === 'NotFound') {
      return to.fullPath;
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
