import { defineConfig } from 'vite-plus';
import { ubeanPlugin } from 'ubean/vite';
import UnoCSS from 'unocss/vite';
import { fmt, lint } from '@soybeanjs/oxc-config';
import { buildDependencyManifest } from './scripts/dependency-manifest';

// about 页的依赖清单在构建期解析：版本号真实值只在 pnpm-workspace.yaml 的 catalog 段，
// 解析要带 YAML 解析器（约 30 kB gzip）。这里解析一次并把结果字面量注入客户端，
// `yaml` 因此只需是 devDependency。（函数值无法进 define，必须 JSON.stringify。）
const dependencyManifest = JSON.stringify(buildDependencyManifest());

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
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEPENDENCIES__: dependencyManifest
  },
  fmt,
  lint,
  resolve: {
    tsconfigPaths: true
  },
  plugins: [ubeanPlugin(), UnoCSS()]
});
