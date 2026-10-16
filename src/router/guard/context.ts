/**
 * 守卫共享判定（P2-16）。
 *
 * ⚠️ vp dev 关键约束（实测教训，勿回退）：
 * ubean dev 的 HTML 请求会在 **Node 里预渲染执行应用与守卫**，且该上下文带
 * 「client 编译标志」—— `import.meta.server === false`（不可用它判定！），
 * 但 `window`/`localStorage` 均不存在。守卫若在此上下文跑鉴权重定向，会因
 * `localStorage` 缺失恒判未登录而无限重定向（挂起请求或 dev 进程崩溃）。
 * 因此判据是**能力检测**，不是编译标志。
 *
 * 回归保护见 `test/specs/guards/env-flag-guard.test.ts`。
 */
export function isBrowserContext(): boolean {
  return typeof window !== 'undefined';
}
