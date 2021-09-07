import WindiCSS from 'vite-plugin-windicss';
import html from './html';
import iconify from './iconify';

const plugins = [...html, ...iconify, WindiCSS()];

export default plugins;
