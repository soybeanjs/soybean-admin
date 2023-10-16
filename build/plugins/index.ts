import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import unocss from '@unocss/vite';
// import progress from 'vite-plugin-progress';
import VueDevtools from 'vite-plugin-vue-devtools';
import pageRoute from '@soybeanjs/vite-plugin-vue-page-route';
import unplugin from './unplugin';
import mock from './mock';
import visualizer from './visualizer';
import compress from './compress';
import pwa from './pwa';

/**
 * vite插件
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    VueDevtools(),
    ...unplugin(viteEnv),
    unocss(),
    mock(viteEnv)
    // progress()
  ];

  if (viteEnv.VITE_VISUALIZER === 'Y') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    plugins.push(visualizer as PluginOption);
  }
  if (viteEnv.VITE_COMPRESS === 'Y') {
    plugins.push(compress(viteEnv));
  }
  if (viteEnv.VITE_PWA === 'Y' || viteEnv.VITE_VERCEL === 'Y') {
    plugins.push(pwa());
  }
  if (viteEnv.VITE_SOYBEAN_ROUTE_PLUGIN === 'Y') {
    plugins.push(pageRoute());
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return plugins;
}

/**
 * vite插件
 * @param viteEnv - 环境变量配置
 */
export function setupFarmVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [
    () => ({
      vitePlugin: vue({
        script: {
          defineModel: true
        }
      }),
      filters: ['\\.vue$', '\\\\0.+']
    }),
    () => ({
      vitePlugin: vueJsx(),
      filters: ['\\.vue$', '\\\\0.+']
    }),
    // VueDevtools(),
    ...unplugin(viteEnv, true),
    // unocss(),
    mock(viteEnv)
    // progress()
  ];

  if (viteEnv.VITE_VISUALIZER === 'Y') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    plugins.push(visualizer as PluginOption);
  }
  if (viteEnv.VITE_COMPRESS === 'Y') {
    plugins.push(compress(viteEnv));
  }
  if (viteEnv.VITE_PWA === 'Y' || viteEnv.VITE_VERCEL === 'Y') {
    plugins.push(pwa());
  }
  if (viteEnv.VITE_SOYBEAN_ROUTE_PLUGIN === 'Y') {
    plugins.push(pageRoute());
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return plugins;
}
