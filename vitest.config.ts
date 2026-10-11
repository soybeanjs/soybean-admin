import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { buildDependencyManifest } from './scripts/dependency-manifest';

// 与 `vite.config.ts` 的 define 保持一致：`vite.config.ts` 的 define 只作用于
// dev/build，单测跑在 vitest 自己的转换管线里，自由变量不会自动可用。
const dependencyManifest = JSON.stringify(buildDependencyManifest());

const srcDir = fileURLToPath(new URL('./src/', import.meta.url));

/**
 * 测试目录分层（对齐 `soybean-ui/packages/ui/test` 的组织方式）：
 *
 * - `test/specs/**`        纯逻辑单测（环境 `node`，不碰网络），按被测源码域分子目录：
 *                          `components/` `composables/` `db/` `request/` `schema/` `shared/`
 *                          `store/` `guards/`（静态纪律守卫）`scripts/`（构建脚本契约）。
 * - `test/integration/**`  真实 HTTP 集成测试（P1-10）：`globalSetup` 自起/复用 dev server，
 *                          用例见 `test/integration/api.test.ts`（认证全链路 + RBAC + 8 套
 *                          CRUD 生命周期）；`e2e.test.ts` 需 `PW_E2E=1` 与真实浏览器。
 * - `test/shared/**`       跨用例共用的辅助模块（断言/夹具），不被 include 收集。
 *
 * 单测从 `src/**` 迁出后统一经 `@/*` 别名导入被测模块，不再依赖相对路径层级。
 */
export default defineConfig({
  test: {
    include: ['test/specs/**/*.{test,spec}.{ts,tsx}', 'test/integration/**/*.{test,spec}.{ts,tsx}'],
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
      '@': srcDir
    }
  }
});
