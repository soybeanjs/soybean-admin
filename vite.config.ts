import { defineConfig } from 'vite-plus';
import { ubeanPlugin } from 'ubean/vite';
import UnoCSS from 'unocss/vite';
import { fmt, lint } from '@soybeanjs/oxc-config';
import { buildDependencyManifest } from './scripts/dependency-manifest';

// about 页的依赖清单在构建期解析：版本号真实值只在 pnpm-workspace.yaml 的 catalog 段，
// 解析要带 YAML 解析器（约 30 kB gzip）。这里解析一次并把结果字面量注入客户端，
// `yaml` 因此只需是 devDependency。（函数值无法进 define，必须 JSON.stringify。）
const dependencyManifest = JSON.stringify(buildDependencyManifest());

/**
 * 必须打进服务端 bundle 的第三方包（dev 走 `ssr.noExternal`，build 走
 * `environments.ubean.resolve.noExternal`，两份共用本列表）。
 *
 * 这些库的 ESM/CJS 产物 Node 直接 import 就炸，两类原因：
 *
 * 1. **解析不了** —— `@visactor/*`（vchart / vtable / vrender / vdataset…）的产物用无扩展名
 *    相对导入（`from "./input-editor"`、`from "./register-arc"`），Node ESM 拒绝解析；
 * 2. **求值就崩** —— `wangeditor` / `print-js` / `vue-pdf-embed` 在模块顶层访问 `window`，
 *    Node 下抛 `window is not defined`。
 *
 * 后果不只是运行时：构建期「从 SSR entry 取 `/_openapi.json` 生成 `.ubean/openapi.d.ts`」
 * 会因 entry import 失败而跳过（只 warn 不报错），于是 CI 里 `pnpm build` 之后
 * `pnpm typecheck` 找不到 `~ubean/openapi`。
 *
 * 每条都带 `(\/.*)?` 允许子路径：这些包之间大量用深路径互引
 * （`@visactor/vrender-core/es/register/graphic`），只写包名匹配不到。
 */
const SSR_BUNDLED_PACKAGES = [
  /^@visactor\/vchart(-theme)?(\/.*)?$/,
  /^@visactor\/vtable(-gantt|-editors)?(\/.*)?$/,
  /^@visactor\/vue-vtable(\/.*)?$/,
  /^dhtmlx-gantt(\/.*)?$/,
  /^eventemitter3(\/.*)?$/,
  /^wangeditor(\/.*)?$/,
  /^print-js(\/.*)?$/,
  /^vue-pdf-embed(\/.*)?$/,
  /^@visactor\/vrender(-components|-core|-kits|-animate)?(\/.*)?$/,
  /^@visactor\/vutils(-extension)?(\/.*)?$/,
  /^@visactor\/vlayouts(\/.*)?$/,
  /^@visactor\/vscale(\/.*)?$/,
  /^@visactor\/vdataset(\/.*)?$/
];

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
  ssr: { noExternal: SSR_BUNDLED_PACKAGES },
  environments: {
    ubean: {
      resolve: { noExternal: SSR_BUNDLED_PACKAGES }
    }
  },
  plugins: [ubeanPlugin(), UnoCSS()]
});
