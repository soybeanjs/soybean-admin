const PluginMap = () => import('./map/index.vue');
const PluginVideo = () => import('./video/index.vue');
const PluginEditorQuill = () => import('./editor/quill/index.vue');
const PluginEditorMarkdown = () => import('./editor/markdown/index.vue');
const PluginSwiper = () => import('./swiper/index.vue');
const PluginCopy = () => import('./copy/index.vue');
const PluginIcon = () => import('./icon/index.vue');
const PluginPrint = () => import('./print/index.vue');

export {
  PluginMap,
  PluginVideo,
  PluginEditorQuill,
  PluginEditorMarkdown,
  PluginSwiper,
  PluginCopy,
  PluginIcon,
  PluginPrint
};
