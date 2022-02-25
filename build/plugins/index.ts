import type { ConfigEnv, PluginOption } from 'vite';
import vue from './vue';
import html from './html';
import iconify from './iconify';
import windicss from './windicss';
import mock from './mock';
import visualizer from './visualizer';
import svgSprite from './svgSprite';

export function setupVitePlugins(configEnv: ConfigEnv): (PluginOption | PluginOption[])[] {
  const plugins = [vue, html(configEnv), ...iconify, windicss, mock, svgSprite];

  if (configEnv.command === 'build') {
    plugins.push(visualizer);
  }

  return plugins;
}
