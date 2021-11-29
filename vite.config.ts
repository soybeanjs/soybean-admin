import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import { plugins, define } from './build';

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, `.env.${mode}`);

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins,
    server: {
      host: '0.0.0.0'
    },
    build: {
      brotliSize: false,
      sourcemap: false
    }
  };
});
