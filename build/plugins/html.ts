import { loadEnv } from 'vite';
import type { ConfigEnv, PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default (config: ConfigEnv): PluginOption[] => {
  const viteEnv = loadEnv(config.mode, `.env.${config.mode}`);

  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        appName: viteEnv.VITE_APP_NAME,
        appTitle: viteEnv.VITE_APP_TITLE,
      },
    },
  });
};
