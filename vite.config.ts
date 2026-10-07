import { defineConfig } from 'vite-plus';
import { ubeanPlugin } from 'ubean/vite';
import UnoCSS from 'unocss/vite';
import { fmt, lint } from '@soybeanjs/oxc-config';

export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  fmt,
  lint,
  resolve: {
    tsconfigPaths: true
  },
  plugins: [ubeanPlugin(), UnoCSS()]
});
