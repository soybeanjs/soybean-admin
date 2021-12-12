import { minifyHtml, injectHtml } from 'vite-plugin-html'; // html插件(使用变量、压缩)
import viteEnv from '../env';

export default [
  minifyHtml(),
  injectHtml({
    injectData: {
      appName: viteEnv.VITE_APP_NAME,
      appTitle: viteEnv.VITE_APP_TITLE
    }
  })
];
