import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { viteDefine, setupVitePlugins, createViteProxy } from './build';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv;

  const rootPath = fileURLToPath(new URL('./', import.meta.url));
  const srcPath = `${rootPath}src`;

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath
      }
    },
    define: viteDefine,
    plugins: setupVitePlugins(viteEnv, srcPath),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3200,
      open: true,
      proxy: createViteProxy(viteEnv)
    },
    build: {
      brotliSize: false
    }
  };
});
