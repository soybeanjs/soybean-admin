/** Vue 文档（外链菜单：新窗口打开，不产生路由） 详见 docs/v3-notes.md N-459。 */
definePage({
  routable: false,
  meta: {
    menuType: 'link',
    href: 'https://cn.vuejs.org/',
    title: 'Vue 文档',
    i18nKey: 'route.docVue',
    icon: 'mdi:vuejs',
    order: 1,
    menuParent: 'DocumentationIndex'
  }
});
