import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { viteEnv, plugins } from './build';

export default defineConfig({
  base: viteEnv.VITE_BASE_URL,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/scss/global.scss" as *;`
      }
    }
  },
  plugins: [vue(), ...plugins],
  build: {
    brotliSize: false
  }
});
