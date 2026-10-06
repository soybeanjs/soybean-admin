import { defineConfig } from 'vitest/config';

/**
 * Phase 0 起 vitest 只跑 `src/**` 下的纯逻辑测试（schema / composable / util）。
 * 需要真实 HTTP 的集成测试（typed client ↔ API 路由）另建 `test/` 与
 * globalSetup 起 dev server，参照 `ubean/examples/ubean-test/vitest.config.ts`。
 */
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'node',
    testTimeout: 30000
  },
  resolve: {
    alias: {
      '@': new URL('./src/', import.meta.url).pathname
    }
  }
});
