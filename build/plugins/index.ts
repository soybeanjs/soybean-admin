import type { ConfigEnv, PluginOption } from 'vite';
import vue from './vue';
import vueJsx from './jsx';
import html from './html';
import autoImport from './auto-import';
import unocss from './unocss';
import mock from './mock';
import visualizer from './visualizer';

/**
 *	vite插件
 * @param configEnv - 环境
 * @param srcPath - src路径
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(
  configEnv: ConfigEnv,
  srcPath: string,
  viteEnv: ImportMetaEnv
): (PluginOption | PluginOption[])[] {
  const plugins = [vue, vueJsx, html(configEnv), ...autoImport(srcPath), unocss, mock];

  if (configEnv.command === 'build' && viteEnv.VITE_VISUALIZER === 'true') {
    plugins.push(visualizer);
  }

  return plugins;
}
