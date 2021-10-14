import WindiCSS from 'vite-plugin-windicss';
import vue from './vue';
import html from './html';
import iconify from './iconify';
import visualizer from './visualizer';

const plugins = [vue(), ...html, ...iconify, WindiCSS(), visualizer];

export default plugins;
