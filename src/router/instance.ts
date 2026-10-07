import type { Router } from 'vue-router';

/**
 * Router 单例存取点（无环模块）。
 *
 * ubean 的 router 由框架在 `createUbeanClientApp` 内部创建，应用代码拿不到
 * 构造期实例；而守卫（`src/router/guard.ts`）依赖 store、store 又要用 router，
 * 若 store 直接 `import { router } from '@/router'` 会形成
 * `store → @/router → guard → store` 的模块环 —— vp dev 的转换管线对这类环
 * 会静默死锁（0% CPU、请求永不返回，已实测）。
 *
 * 因此拆出本叶子模块：store 只依赖本文件（无任何回边），router 实例由守卫
 * setup 期 `installRouter` 注入。非 setup 上下文（store action、布局事件）
 * 一律 `getRouter()` 取用；在 `setupRouterGuard` 之前调用会抛错（正常时序下
 * 不会发生：守卫注册先于任何导航）。
 */
let instance: Router | null = null;

/** 由 `setupRouterGuard` 在框架注入 router 时调用（幂等，重复安装告警） */
export function installRouter(router: Router): void {
  if (instance && instance !== router) {
    console.warn('[router] router 实例被重复安装，已覆盖');
  }
  instance = router;
}

/** 取全局 router 实例（未安装时抛错，尽早暴露时序问题） */
export function getRouter(): Router {
  if (!instance) {
    throw new Error('[router] router 实例尚未安装（setupRouterGuard 未执行）');
  }

  return instance;
}
