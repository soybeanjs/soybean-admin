import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins, define } from './build';
import { getEnvConfig } from './.env-config';

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, `.env.${configEnv.mode}`) as ImportMetaEnv;

  const srcPath = fileURLToPath(new URL('./src', import.meta.url));
  const rootPath = fileURLToPath(new URL('./', import.meta.url));

  const { http } = getEnvConfig(viteEnv);

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': srcPath,
        '~': rootPath,
      },
    },
    define,
    plugins: setupVitePlugins(configEnv, srcPath, viteEnv),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`,
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
      host: '0.0.0.0',
      port: 3200,
      open: true,
      proxy: {
        [http.proxy]: {
          target: http.url,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${http.proxy}`), ''),
        },
      },
    },
    build: {
      brotliSize: false,
      sourcemap: false,
    },
  };
});
