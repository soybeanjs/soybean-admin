import type { PluginOption } from 'vite';
import vue from './vue';
import html from './html';
import unplugin from './unplugin';
import unocss from './unocss';
import mock from './mock';
import visualizer from './visualizer';
import compress from './compress';

/**
 * vite插件
 * @param viteEnv - 环境变量配置
 * @param srcPath - src路径
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv, srcPath: string): (PluginOption | PluginOption[])[] {
  const plugins = [...vue, html(viteEnv), ...unplugin(srcPath), unocss, mock];

  if (viteEnv.VITE_VISUALIZER === 'true') {
    plugins.push(visualizer);
  }
  if (viteEnv.VITE_COMPRESS === 'true') {
    plugins.push(compress(viteEnv));
  }

  return plugins;
}
