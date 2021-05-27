import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { alias, viteEnv, plugins } from './build';

export default defineConfig({
  base: viteEnv.VITE_BASE_URL,
  resolve: { alias },
  plugins: [vue(), ...plugins]
});
