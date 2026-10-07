import { defineConfig } from 'vite-plus';
import { ubeanPlugin } from 'ubean/vite';
import UnoCSS from 'unocss/vite';
import { fmt, lint } from '@soybeanjs/oxc-config';

export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  server: {
    // dev server 固定 9527：与 .env 的 SERVER_PORT / SERVER_INTERNAL_URL、
    // test/global-setup.ts 的健康检查地址三方对齐。
    // 注意：vp dev 不读 ubean.config.ts 的 dev.port（那是 `ubean dev` CLI 的配置），
    // vite 默认落到 5173，导致 global-setup 轮询 9527 永远超时；
    // strictPort 让端口被占时直接失败，而不是静默漂移到 5173+。
    port: 9527,
    strictPort: true
  },
  fmt,
  lint,
  resolve: {
    tsconfigPaths: true
  },
  plugins: [ubeanPlugin(), UnoCSS()]
});
