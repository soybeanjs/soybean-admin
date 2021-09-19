import WindiCSS from 'vite-plugin-windicss';
import vue from './vue';
import html from './html';
import iconify from './iconify';

const plugins = [vue(), ...html, ...iconify, WindiCSS()];

export default plugins;
