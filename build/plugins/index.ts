import vue from './vue';
import html from './html';
import iconify from './iconify';
import windicss from './windicss';
import visualizer from './visualizer';
import mock from './mock';

const plugins = [vue, ...html, ...iconify, windicss, visualizer, mock];

export default plugins;
