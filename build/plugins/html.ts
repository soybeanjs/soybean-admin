import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default (viteEnv: ImportMetaEnv): PluginOption[] => {
  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        appName: viteEnv.VITE_APP_NAME,
        appTitle: viteEnv.VITE_APP_TITLE
      }
    }
  });
};
