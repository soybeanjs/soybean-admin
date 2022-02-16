import { loadEnv } from 'vite';
import type { ConfigEnv, PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html'; // html插件(使用变量、压缩)

export default (config: ConfigEnv): PluginOption[] => {
  const viteEnv = loadEnv(config.mode, `.env.${config.mode}`);

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
