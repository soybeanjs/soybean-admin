import WindiCSS from 'vite-plugin-windicss';
import html from './html';
import iconify from './iconify';
import styleImport from './style-import';

const plugins = [...html, ...iconify, ...styleImport, WindiCSS()];

export default plugins;
