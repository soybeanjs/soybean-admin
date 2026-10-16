import { fileURLToPath } from 'node:url';
import { ensureUbeanConfig } from 'ubean/vite';
import { ubeanEnvPlugin } from '@ubean/build/env';
import { defineConfig } from 'vitest/config';
import { buildDependencyManifest } from './scripts/dependency-manifest';

// 与 `vite.config.ts` 的 define 保持一致：`vite.config.ts` 的 define 只作用于
// dev/build，单测跑在 vitest 自己的转换管线里，自由变量不会自动可用。
const dependencyManifest = JSON.stringify(buildDependencyManifest());

const srcDir = fileURLToPath(new URL('./src/', import.meta.url));

/**
 * 让 `ubean:env/client` / `ubean:env/server` 在单测里也能解析。
 *
 * 这两个虚拟模块由 `ubean/vite` 的 `ubeanPlugin()` 装配，而 vitest 走自己的 transform
 * 管线、不加载 `vite.config.ts` —— 少了这段，任何 import `@/constants/service`（→
 * `ubean:env/client`）的单测都会抛 `Failed to resolve import "ubean:env/client"`。
 *
 * 这里复用 ubean **真实**的 env 插件（而非手写桩）：取值规则（`.env` 回退链、number
 * 转换、`mode: 'throw'` 的必填校验）与 dev/build 完全一致，不会出现「测试绿但线上炸」。
 *
 * `ensureUbeanConfig()` 返回已归一化的 config（含 `env.schema`，由 `ubean.config.ts` 提供）；
 * 插件在 `configResolved` 里自己 `loadEnv()` 并读 `process.env`，因此无需额外接线。
 * vitest 的 `environment: 'node'` 对应 vite environment name `ssr`（不是 `client`），
 * 所以 `ubean:env/server` 不会被插件的「客户端导入即构建失败」护栏误拦截。
 */
const ubeanConfig = await ensureUbeanConfig();

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
  plugins: [ubeanEnvPlugin({ config: ubeanConfig })],
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
