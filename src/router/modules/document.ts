const document: AuthRoute.Route = {
  name: 'document',
  path: '/document',
  component: 'basic',
  children: [
    {
      name: 'document_vue',
      path: '/document/vue',
      component: 'self',
      meta: {
        title: 'vue文档',
        requiresAuth: true,
        icon: 'mdi:vuejs'
      }
    },
    {
      name: 'document_vue-new',
      path: '/document/vue-new',
      component: 'self',
      meta: {
        title: 'vue文档(新版)',
        requiresAuth: true,
        icon: 'mdi:vuejs'
      }
    },
    {
      name: 'document_vite',
      path: '/document/vite',
      component: 'self',
      meta: {
        title: 'vite文档',
        requiresAuth: true,
        icon: 'simple-icons:vite'
      }
    },
    {
      name: 'document_project',
      path: '/document/project',
      meta: {
        title: '项目文档(外链)',
        requiresAuth: true,
        icon: 'mdi:file-link-outline',
        href: 'https://docs.soybean.pro/'
      }
    }
  ],
  meta: {
    title: '文档',
    icon: 'carbon:document',
    order: 2
  }
};

export default document;
