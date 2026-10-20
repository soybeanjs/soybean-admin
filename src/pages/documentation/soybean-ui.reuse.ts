/** SoybeanUI 文档（内嵌菜单：复用 (builtin)/iframe 页的组件，地址取自 `meta.iframeUrl`） 详见 docs/v3-notes.md N-460。 */
definePage({
  reuse: 'IframeUrl',
  meta: {
    menuType: 'iframe',
    iframeUrl: 'https://ui.soybeanjs.cn/',
    title: 'SoybeanUI 文档',
    i18nKey: 'route.docSoybeanUi',
    icon: 'mdi:palette-outline',
    order: 2,
    menuParent: 'DocumentationIndex'
  }
});
