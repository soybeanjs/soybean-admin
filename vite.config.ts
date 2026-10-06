import { defineConfig } from 'vite-plus';
import { ubeanPlugin } from 'ubean/vite';
import UnoCSS from 'unocss/vite';
import { fmt, lint } from '@soybeanjs/oxc-config';

export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  fmt,
  lint,
  // 让 vite 直接消费 tsconfig 的 `paths`（`@/*` → `./src/*`）
  resolve: {
    tsconfigPaths: true
  },
  // 开发端口：本项目 dev script 是 `vp dev`（裸 Vite 路径，ADR-0012），
  // 该路径只认这里的 `server.port`；`ubean.config.ts` 的 `dev.port`
  // 仅在 `ubean dev` CLI 路径生效（两者默认值同为 9527，保持一致）。
  server: {
    port: 9527
  },
  optimizeDeps: {
    // 组件库走源码 ESM，预构建会破坏 UnoCSS 的 filesystem content 扫描
    exclude: ['@vean/ui', '@vean/aria']
  },
  plugins: [ubeanPlugin(), UnoCSS()]
});
