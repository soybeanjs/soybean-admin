import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { alias, viteEnv, plugins } from './build';

export default defineConfig({
  base: viteEnv.VITE_BASE_URL,
  resolve: { alias },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/scss/global.scss" as *;`
      }
    }
  },
  plugins: [vue(), ...plugins]
});
