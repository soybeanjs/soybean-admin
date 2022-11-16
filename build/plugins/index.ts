import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import unocss from '@unocss/vite';
import routerPage from '@soybeanjs/router-page';
import html from './html';
import unplugin from './unplugin';
import mock from './mock';

/**
 * vite插件
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [vue(), vueJsx(), html(viteEnv), ...unplugin(viteEnv), unocss(), mock, routerPage()];

  return plugins;
}
