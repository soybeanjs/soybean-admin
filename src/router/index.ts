export { setupRouterGuard } from './guard';

/**
 * 路由出口（刻意极薄）：
 * - `./instance`：router 单例存取（叶子模块）。store / 布局 / 页面要用 router
 *   时**只准** `import { getRouter } from '@/router/instance'`，不准经由本
 *   index —— index 会拉进 guard，guard 又依赖 `@/store`，形成
 *   `store → @/router → guard → store` 模块环。该环 + 动态 import 会让
 *   vp dev 的转换管线静默死锁（0% CPU、HTML/模块请求永不返回，已实测）。
 * - `./guard`：守卫链（`defineApp({ router: { setup } })` 的注册函数）。
 */
