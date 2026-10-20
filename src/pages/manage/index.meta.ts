/** 系统管理（纯分组目录，无对应组件；ubean 元数据页） 详见 docs/v3-notes.md N-458。 */
definePage({
  routable: false,
  meta: {
    menuType: 'directory',
    title: '系统管理',
    i18nKey: 'route.manage',
    icon: 'mdi:cog-outline',
    order: 2
  }
});
