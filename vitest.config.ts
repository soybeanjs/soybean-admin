import { defineConfig } from 'vitest/config';
import { buildDependencyManifest } from './scripts/dependency-manifest';

// 与 `vite.config.ts` 的 define 保持一致：`vite.config.ts` 的 define 只作用于
// dev/build，单测跑在 vitest 自己的转换管线里，自由变量不会自动可用。
const dependencyManifest = JSON.stringify(buildDependencyManifest());

/**
 * Phase 0 起 vitest 只跑 `src/**` 下的纯逻辑测试（schema / composable / util）；
 * `test/**` 为真实 HTTP 集成测试（P1-10）：globalSetup 自起/复用 dev server，
 * 用例见 `test/api.test.ts`（认证全链路 + RBAC + 8 套 CRUD 生命周期）。
 */
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'test/**/*.{test,spec}.{ts,tsx}'],
    environment: 'node',
    testTimeout: 30_000,
    globalSetup: ['test/global-setup.ts'],
    // 集成测试串行执行（共享 DB 与 seed 数据，避免用例间相互污染）
    fileParallelism: false
  },
  define: {
    // 与 `vite.config.ts` 的 define 保持一致：`vite.config.ts` 的 define 只作用于
    // dev/build，单测跑在 vitest 自己的转换管线里，自由变量不会自动可用。
    // 单测不需要「真实构建时间」，固定值让断言可复现。
    __BUILD_TIME__: JSON.stringify('2026-01-01T00:00:00.000Z'),
    __DEPENDENCIES__: dependencyManifest
  },
  resolve: {
    alias: {
      '@': new URL('./src/', import.meta.url).pathname
    }
  }
});
