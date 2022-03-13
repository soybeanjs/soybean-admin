import { defineConfig, loadEnv } from 'vite';
import { resolvePath, viteDefine, setupVitePlugins, createViteProxy } from './build';

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, `.env.${configEnv.mode}`) as ImportMetaEnv;
  const vitePath = resolvePath('./', import.meta.url);

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': vitePath.root,
        '@': vitePath.src,
      },
    },
    define: viteDefine,
    plugins: setupVitePlugins(configEnv, vitePath.src, viteEnv),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(viteEnv.VITE_SERVER_PORT),
      open: true,
      proxy: createViteProxy(viteEnv),
    },
    build: {
      brotliSize: false,
    },
  };
});
