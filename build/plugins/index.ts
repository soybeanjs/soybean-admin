import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import unocss from '@unocss/vite';
import progress from 'vite-plugin-progress';
import VueDevtools from 'vite-plugin-vue-devtools';
import pageRoute from '@soybeanjs/vite-plugin-vue-page-route';
import { webUpdateNotice } from '@plugin-web-update-notification/vite';
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
    mock(viteEnv),
    progress(),
    webUpdateNotice({
      notificationProps: {
        title: '👋 有新版本了',
        description: '点击刷新页面获取最新版本',
        buttonText: '刷新',
        dismissButtonText: '忽略'
      }
    })
  ];

  if (viteEnv.VITE_VISUALIZER === 'Y') {
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

  return plugins;
}
